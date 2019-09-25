const { combineResolvers } = require('graphql-resolvers');
const { Converter, RedisCache } = require('../../utils');
const cache = {
  transaction: 'transaction',
  block: 'block',
};

module.exports = {
  Query: {
    search: combineResolvers((parent, args, { models }) => {
      const cacheBlocks = Converter.formatCache(cache.block, args);
      const { Id } = args;

      return new Promise((resolve, reject) => {
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.findOne()
            .where({ BlockID: Id })
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);
              if (result)
                return resolve({
                  ID: result.BlockID,
                  Height: result.Height,
                  Timestamp: result.Timestamp,
                  FoundIn: 'Block',
                });

              const cacheTransaction = Converter.formatCache(cache.transaction, args);
              RedisCache.get(cacheTransaction, (err, resRedis) => {
                if (err) return reject(err);
                if (resRedis) return resolve(resRedis);

                models.Transactions.findOne()
                  .where({ TransactionID: Id })
                  .lean()
                  .exec((err, result) => {
                    if (err) return reject(err);
                    if (!result) return resolve({});

                    return resolve({
                      ID: result.TransactionID,
                      Height: result.Height,
                      Timestamp: result.Timestamp,
                      FoundIn: 'Transaction',
                    });
                  });
              });
            });
        });
      });
    }),
  },
};
