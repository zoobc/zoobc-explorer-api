const { Converter, RedisCache } = require('../../utils');

const cache = {
  searchTransaction: 'searchTransaction',
  searchBlock: 'searchBlock',
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

          models.Blocks.findOne()
            .where({ BlockID: Id })
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

                  models.Transactions.findOne()
                    .where({ TransactionID: Id })
                    .lean()
                    .exec((err, transaction) => {
                      if (err) return reject(err);
                      if (!transaction) return resolve({});

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
                    });
                });
              }
            });
        });
      });
    },
  },
};
