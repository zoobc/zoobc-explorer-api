const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;

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
      const { page, limit, order, BlockID } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' };
      const where = BlockID !== undefined ? { BlockID } : {};

      return new Promise((resolve, reject) => {
        const cacheTransactions = Converter.formatCache(cache.transactions, args);
        RedisCache.get(cacheTransactions, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Transactions.countDocuments((err, total) => {
            if (err) return reject(err);

            models.Transactions.find()
              .where(where)
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
                    Total: total,
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
};
