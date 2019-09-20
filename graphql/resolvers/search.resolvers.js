const { combineResolvers } = require('graphql-resolvers');
const { Converter, RedisCache } = require('../../utils');

const cache = {
  transaction: 'transaction',
  block: 'block',
};

module.exports = {
  Query: {
    search: combineResolvers((parent, args, { models }) => {
      const { Id } = args;
      const cacheBlocks = Converter.formatCache(cache.block, args);

      return new Promise((resolve, reject) => {
        var SearchResult = {
          ID: null,
          Height: null,
          Timestamp: null,
          FoundIn: null,
        };
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.findOne()
            .where({ ID: Id })
            .lean()
            .exec((err, results) => {
              if (err) {
                return reject(err);
              }
              if (results) {
                const result = Array.isArray(results) ? results[0] : results;

                SearchResult.ID = result.ID
                SearchResult.Height = result.Height
                SearchResult.Timestamp = result.Timestamp
                SearchResult.FoundIn = "Block"
                RedisCache.set(cacheBlocks, SearchResult, err => {
                  if (err) return reject(err);
                  return resolve(SearchResult);
                });
              } else {
                const cacheTransaction = Converter.formatCache(cache.transaction, args);
                RedisCache.get(cacheTransaction, (err, resRedis) => {
                  if (err) return reject(err);
                  if (resRedis) return resolve(resRedis);

                  models.Transactions.findOne()
                    .where({ ID: Id })
                    .lean()
                    .exec((err, results) => {
                      if (err) return reject(err);
                      if (results){
                      const result = Array.isArray(results) ? results[0] : results;
                      SearchResult.ID = result.ID
                SearchResult.Height = result.Height
                SearchResult.Timestamp = result.Timestamp
                SearchResult.FoundIn = "Transaction"
                      // resSearch.transaction = result;
                      RedisCache.set(cacheTransaction, SearchResult, err => {
                        if (err) return reject(err);
                        return resolve(SearchResult);
                      });
                    }
                    else {
                      return resolve(SearchResult);
                    }
                    });
                });
              }
            });
        });
      });
    }),
  },
};
