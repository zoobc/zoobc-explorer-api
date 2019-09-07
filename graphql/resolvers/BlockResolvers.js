const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Block } = require('../../models');
const { pubsub, events } = require('../subscription');
const { Converter, RedisCache } = require('../../utils');

const chainType = 0;
const limit = 10;
const height = 1;
const cache = {
  blocks: 'blocks',
  block: 'block',
};

module.exports = {
  Query: {
    blocks: combineResolvers(async (parent, args, context, info) => {
      try {
        const { ChainType = chainType, Limit = limit, Height = height } = args;

        return new Promise((resolve, reject) => {
          const cacheBlocks = Converter.formatCache(cache.blocks, args);
          RedisCache.get(cacheBlocks, (errRedis, resRedis) => {
            if (errRedis) return reject(errRedis);
            if (resRedis) return resolve(resRedis);

            Block.GetBlocks({ ChainType, Limit, Height }, (err, result) => {
              if (err) return reject(err);

              const { Blocks = null } = result;
              Converter.formatDataGRPC(Blocks);
              RedisCache.set(cacheBlocks, result, errRedis => {
                if (errRedis) return reject(errRedis);
                return resolve(result);
              });
            });
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Blocks Error:', error);
      }
    }),

    block: combineResolvers(async (parent, args, context, info) => {
      try {
        const { ChainType = chainType, Height = height, ID } = args;

        return new Promise((resolve, reject) => {
          const cacheBlock = Converter.formatCache(cache.block, args);
          RedisCache.get(cacheBlock, (errRedis, resRedis) => {
            if (errRedis) return reject(errRedis);
            if (resRedis) return resolve(resRedis);

            Block.GetBlock({ ChainType, ID, Height }, (err, result) => {
              if (err) return reject(err);
              Converter.formatDataGRPC2(result);
              RedisCache.set(cacheBlock, result, errRedis => {
                if (errRedis) return reject(errRedis);
                return resolve(result);
              });
            });
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Block Error:', error);
      }
    }),
  },

  Mutation: {
    pushBlocks: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          Block.GetBlocks({ ChainType: 0, Limit: 2, Height: 1 }, (err, result) => {
            if (err) return reject(err);
            const { Blocks = null } = result;
            Converter.formatDataGRPC(Blocks);
            pubsub.publish(events.blocks, { blocks: result });
            return resolve(result);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Set Push Block:', error);
      }
    }),
  },

  Subscription: {
    blocks: {
      subscribe: () => pubsub.asyncIterator([events.blocks]),
    },
  },
};
