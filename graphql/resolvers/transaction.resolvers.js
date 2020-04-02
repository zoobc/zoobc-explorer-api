const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;
const { pubsub, events } = require('../subscription');

const cache = {
  transactions: 'transactions',
  transaction: 'transaction',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    transactions: (parent, args, { models }) => {
      const { page, limit, order, BlockID, AccountAddress } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' };
      const blockId = BlockID !== undefined ? { BlockID } : null;
      const accountAddress = AccountAddress !== undefined ? { $or: [{ Sender: AccountAddress }, { Recipient: AccountAddress }] } : null;

      return new Promise((resolve, reject) => {
        const cacheTransactions = Converter.formatCache(cache.transactions, args);
        RedisCache.get(cacheTransactions, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Transactions.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err);

            models.Transactions.where(blockId ? blockId : accountAddress ? accountAddress : {}).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err);

              models.Transactions.find()
                .where(blockId ? blockId : accountAddress ? accountAddress : {})
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err);

                  const result = {
                    Transactions: data,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: blockId || accountAddress ? totalWithFilter : totalWithoutFilter,
                    },
                  };

                  RedisCache.set(cacheTransactions, result, err => {
                    if (err) return reject(err);
                    return resolve(result);
                  });
                });
            });
          });
        });
      });
    },

    transaction: (parent, args, { models }) => {
      const { TransactionID } = args;

      return new Promise((resolve, reject) => {
        const cacheTransaction = Converter.formatCache(cache.transaction, args);
        RedisCache.get(cacheTransaction, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Transactions.findOne()
            .where({ TransactionID: TransactionID })
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);
              if (!result) return resolve({});

              RedisCache.set(cacheTransaction, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    },
  },

  Transaction: {
    Block: async (transaction, args, { models }) => {
      return await models.Blocks.findOne({ BlockID: transaction.BlockID }).lean();
    },
  },

  Subscription: {
    transactions: {
      subscribe: () => pubsub.asyncIterator([events.transactions]),
    },
  },
};
