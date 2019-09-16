const { combineResolvers } = require('graphql-resolvers');
// const { ForbiddenError, UserInputError } = require('apollo-server');
// const { formatApolloErrors, ApolloError } = require('apollo-server-core');

// const { pubsub, events } = require('../subscription');
const { Converter, RedisCache } = require('../../utils');

const pageLimit = require('../../config/config').app.pageLimit;
const cache = {
  blocks: 'blocks',
  block: 'block',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    Blocks: combineResolvers((parent, args, { models }) => {
      const { page, limit, order } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { _id: 'asc' };

      return new Promise((resolve, reject) => {
        const cacheBlocks = Converter.formatCache(cache.blocks, args);
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.find()
            .select()
            .limit(lm)
            .skip((pg - 1) * lm)
            .sort(od)
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);

              RedisCache.set(cacheBlocks, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),

    Block: combineResolvers((parent, args, { models }) => {
      const { ID } = args;

      return new Promise((resolve, reject) => {
        const cacheBlock = Converter.formatCache(cache.block, args);
        RedisCache.get(cacheBlock, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.findOne()
            .where({ ID: ID })
            .lean()
            .exec((err, results) => {
              if (err) return reject(err);

              const result = Array.isArray(results) ? results[0] : results;
              RedisCache.set(cacheBlock, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),
  },

  // Mutation: {
  //   pushBlocks: combineResolvers(async (parent, args, context, info) => {
  //     try {
  //       // return new Promise((resolve, reject) => {
  //       //   Block.GetBlocks({ ChainType: 0, Limit: 2, Height: 1 }, (err, result) => {
  //       //     if (err) return reject(err);
  //       //     const { Blocks = null } = result;
  //       //     Converter.formatDataGRPC(Blocks);
  //       //     pubsub.publish(events.blocks, { blocks: result });
  //       //     return resolve(result);
  //       //   });
  //       // });
  //     } catch (error) {
  //       throw new ForbiddenError('Set Push Block:', error);
  //     }
  //   }),
  // },

  // Subscription: {
  //   blocks: {
  //     subscribe: () => pubsub.asyncIterator([events.blocks]),
  //   },
  // },
};
