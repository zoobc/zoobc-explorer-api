const { Converter, RedisCache } = require('../../utils');

const cache = {
  searchTransaction: 'searchTransaction',
  searchBlock: 'searchBlock',
  searchAccount: 'searchAccount',
};

module.exports = {
  Query: {
    search: (parent, args, { models }) => {
      const { Id } = args;

      return new Promise((resolve, reject) => {
        const cacheBlock = Converter.formatCache(cache.searchBlock, args);
        RedisCache.get(cacheBlock, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          let criteria;
          const checkId = Number(Id);

          if (typeof checkId === 'number' && isNaN(checkId)) {
            criteria = Id !== undefined ? { BlockID: Id } : {};
          } else {
            criteria = Id !== undefined ? { $or: [{ BlockID: Id }, { Height: Id }] } : {};
          }

          models.Blocks.findOne()
            .where(criteria)
            .lean()
            .exec((err, block) => {
              if (err) return reject(err);
              if (block) {
                const resBlock = {
                  ID: block.BlockID,
                  Height: block.Height,
                  Timestamp: block.Timestamp,
                  FoundIn: 'Block',
                };

                RedisCache.set(cacheBlock, resBlock, err => {
                  if (err) return reject(err);
                  return resolve(resBlock);
                });
              } else {
                const cacheTransaction = Converter.formatCache(cache.searchTransaction, args);
                RedisCache.get(cacheTransaction, (err, resRedis) => {
                  if (err) return reject(err);
                  if (resRedis) return resolve(resRedis);

                  criteria = {
                    $or: [
                      { TransactionID: Id },
                      { 'NodeRegistration.NodePublicKey': Id },
                      { 'UpdateNodeRegistration.NodePublicKey': Id },
                      { 'RemoveNodeRegistration.NodePublicKey': Id },
                      { 'ClaimNodeRegistration.NodePublicKey': Id },
                    ],
                  };

                  models.Transactions.findOne()
                    .where(criteria)
                    .lean()
                    .exec((err, transaction) => {
                      if (err) return reject(err);
                      if (transaction) {
                        const resTrx = {
                          ID: transaction.TransactionID,
                          Height: transaction.Height,
                          Timestamp: transaction.Timestamp,
                          FoundIn: 'Transaction',
                        };

                        RedisCache.set(cacheTransaction, resTrx, err => {
                          if (err) return reject(err);
                          return resolve(resTrx);
                        });
                      } else {
                        const cacheAccount = Converter.formatCache(cache.searchAccount, args);
                        RedisCache.get(cacheAccount, (err, resRedis) => {
                          if (err) return reject(err);
                          if (resRedis) return resolve(resRedis);

                          models.Accounts.findOne()
                            .where({ AccountAddress: Id })
                            .lean()
                            .exec((err, account) => {
                              if (err) return reject(err);
                              if (!account) return resolve({});

                              const resAccount = {
                                ID: account.AccountAddress,
                                Height: null,
                                Timestamp: null,
                                FoundIn: 'Account',
                              };

                              RedisCache.set(cacheAccount, resAccount, err => {
                                if (err) return reject(err);
                                return resolve(resAccount);
                              });
                            });
                        });
                      }
                    });
                });
              }
            });
        });
      });
    },
  },
};
