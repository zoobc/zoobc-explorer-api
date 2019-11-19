const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;
const cache = {
  accounts: 'accounts',
  account: 'account',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    accounts: (parent, args, { models }) => {
      const { page, limit, order } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { BlockHeight: 'asc' };

      return new Promise((resolve, reject) => {
        models.Accounts.countDocuments((err, total) => {
          if (err) {
            return reject(err);
          }

          return models.Accounts.find()
            .select()
            .limit(lm)
            .skip((pg - 1) * lm)
            .sort(od)
            .lean()
            .exec()
            .then(data => {
              return data.map(async account => {
                const accountAddress =
                  account.AccountAddress !== undefined
                    ? { $or: [{ Sender: account.AccountAddress }, { Recipient: account.AccountAddress }] }
                    : null;

                return await models.Transactions.find()
                  .where(accountAddress ? accountAddress : {})
                  .lean()
                  .then(data => {
                    account.BalanceConversion = data
                      .map(trx => {
                        const { SendMoney, NodeRegistration, UpdateNodeRegistration } = trx;
                        return {
                          Sender: trx.Sender,
                          FeeConversion: trx.FeeConversion,
                          Amount: SendMoney
                            ? SendMoney.AmountConversion
                            : NodeRegistration
                            ? NodeRegistration.LockedBalanceConversion
                            : UpdateNodeRegistration
                            ? UpdateNodeRegistration.LockedBalanceConversion
                            : '0',
                        };
                      })
                      .map(trx2 => {
                        const { Sender, FeeConversion, Amount } = trx2;

                        if (account.AccountAddress === Sender) {
                          return -(parseFloat(Amount) + parseFloat(FeeConversion));
                        } else {
                          return parseFloat(Amount);
                        }
                      })
                      .reduce((acc, curr) => parseFloat((acc + curr).toFixed(3)), 0);

                    account.LastActive = data
                      .map(x => x.Timestamp)
                      .reduce((a, b) => {
                        return a > b ? a : b;
                      });

                    account.TotalFeesPaidConversion = data.map(x => x.FeeConversion).reduce((acc, curr) => acc + parseFloat(curr), 0);

                    return account;
                  })
                  .catch(err => reject(err));
              });
            })
            .then(final => {
              if (!final) return resolve({});
              const result = {
                Accounts: final,
                Paginate: { Page: parseInt(pg), Count: final.length, Total: total },
              };

              return resolve(result);
            })
            .catch(err => reject(err));
        });
      });
    },

    account: (parent, args, { models }) => {
      const { AccountAddress } = args;

      return new Promise((resolve, reject) => {
        const cacheAccount = Converter.formatCache(cache.account, args);
        RedisCache.get(cacheAccount, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Accounts.findOne()
            .where({ AccountAddress: AccountAddress })
            .lean()
            .exec()
            .then(async account => {
              const accountAddress =
                account.AccountAddress !== undefined
                  ? { $or: [{ Sender: account.AccountAddress }, { Recipient: account.AccountAddress }] }
                  : null;

              return await models.Transactions.find()
                .where(accountAddress ? accountAddress : {})
                .lean()
                .then(data => {
                  account.BalanceConversion = data
                    .map(trx => {
                      const { SendMoney, NodeRegistration, UpdateNodeRegistration } = trx;
                      return {
                        Sender: trx.Sender,
                        FeeConversion: trx.FeeConversion,
                        Amount: SendMoney
                          ? SendMoney.AmountConversion
                          : NodeRegistration
                          ? NodeRegistration.LockedBalanceConversion
                          : UpdateNodeRegistration
                          ? UpdateNodeRegistration.LockedBalanceConversion
                          : '0',
                      };
                    })
                    .map(trx2 => {
                      const { Sender, FeeConversion, Amount } = trx2;

                      if (account.AccountAddress === Sender) {
                        return -(parseFloat(Amount) + parseFloat(FeeConversion));
                      } else {
                        return parseFloat(Amount);
                      }
                    })
                    .reduce((acc, curr) => parseFloat((acc + curr).toFixed(3)), 0);

                  account.LastActive = data
                    .map(x => x.Timestamp)
                    .reduce((a, b) => {
                      return a > b ? a : b;
                    });

                  account.TotalFeesPaidConversion = data.map(x => x.FeeConversion).reduce((acc, curr) => acc + parseFloat(curr), 0);

                  return account;
                })
                .catch(err => reject(err));
            })
            .then(final => {
              if (!final) return resolve({});

              RedisCache.set(cacheAccount, final, err => {
                if (err) return reject(err);
                return resolve(final);
              });
            })
            .catch(err => reject(err));
        });
      });
    },
  },
};
