const { combineResolvers } = require('graphql-resolvers');
const { Blocks, Transactions } = require('../../models');
const { Converter, RedisCache } = require('../../utils');

const cache = {
  transaction: 'transaction',
  block: 'block',
};

module.exports = {
  Query: {
    Search: combineResolvers((parent, args, { models }) => {
      const { Id } = args;
      const cacheBlocks = Converter.formatCache(cache.block, args);

      return new Promise((resolve, reject) => {
        var resSearch = {
          block: null,
          transaction: null,
        };
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          Blocks.findOne()
            .where({ ID: Id })
            .lean()
            .exec((err, results) => {
              if (err) {
                return reject(err);
              }
              if (results) {
                const result = Array.isArray(results) ? results[0] : results;
                resSearch.block = result;
                RedisCache.set(cacheBlocks, resSearch, err => {
                  if (err) return reject(err);
                  return resolve(resSearch);
                });
              } else {
                const cacheTransaction = Converter.formatCache(cache.transaction, args);
                RedisCache.get(cacheTransaction, (err, resRedis) => {
                  if (err) return reject(err);
                  if (resRedis) return resolve(resRedis);

                  Transactions.findOne()
                    .where({ ID: Id })
                    .lean()
                    .exec((err, results) => {
                      if (err) return reject(err);
                      const result = Array.isArray(results) ? results[0] : results;
                      resSearch.transaction = result;
                      RedisCache.set(cacheTransaction, resSearch, err => {
                        if (err) return reject(err);
                        return resolve(resSearch);
                      });
                    });
                });
              }
            });
        });
      });
    }),
  },
};
