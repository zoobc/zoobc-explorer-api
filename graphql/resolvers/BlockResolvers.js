const { ForbiddenError, UserInputError } = require('apollo-server');
const { formatApolloErrors, ApolloError } = require('apollo-server-core');
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
      const cacheBlocks = Converter.formatCache(cache.blocks, args);
      RedisCache.get(cacheBlocks, (errRedis, resRedis) => {
        console.log('===errRedis', errRedis);
        console.log('===resRedis', resRedis);
      });

      // return new Promise((resolve, reject) => {
      //   const { ChainType = chainType, Limit = limit, Height = height } = args;
      //   Block.GetBlocks({ ChainType, Limit, Height }, (err, result) => {
      //     if (result) {
      //       // result.Meta = Meta;
      //       return resolve(result);
      //     }
      //   });
      // });
    }),

    // blocks: combineResolvers(async (parent, args, context, info) => {
    //   try {
    //     const { ChainType = chainType, Limit = limit, Height = height } = args;

    //     return new Promise((resolve, reject) => {
    //       const cacheBlocks = Converter.formatCache(cache.blocks, args);
    //       RedisCache.get(cacheBlocks, (errRedis, resRedis) => {
    //         if (errRedis) return reject(errRedis);
    //         if (resRedis) return resolve(resRedis);

    //         Block.GetBlocks({ ChainType, Limit, Height }, (err, result) => {
    //           if (err) return reject(err);

    //           const { Blocks = null } = result;
    //           Converter.formatDataGRPC(Blocks);
    //           RedisCache.set(cacheBlocks, result, errRedis => {
    //             if (errRedis) return reject(errRedis);
    //             return resolve(result);
    //           });
    //         });
    //       });
    //     });
    //   } catch (error) {
    //     throw new ForbiddenError('Get Blocks Error:', error);
    //   }
    // }),

    // block: combineResolvers(async (parent, args, context, info) => {
    //   const { ChainType = chainType, Height, ID } = args;
    //   if (!ID && !Height) {
    //     const formattedError = new ApolloError('Example message', 'EXAMPLE_CODE');
    //     return formatApolloErrors([formattedError])[0];
    //     // throw new Error('Invalid Payload Parameter');
    //   }

    //   Block.GetBlock({ ChainType, Height, ID }, (err, result) => {

    //     if (err && err.details) {
    //       console.log('===err', err);
    //       // throw Error('new Error(err.details);');
    //       const formattedError = new ApolloError('Example message', 'EXAMPLE_CODE');
    //       return formatApolloErrors([formattedError])[0];
    //     }
    //   });

    //   // return new Promise((resolve, reject) => {
    //   //   const { ChainType = chainType, Height, ID } = args;

    //   //   if (!ID && !Height) {
    //   //     return reject('Invalid Payload Parameter');
    //   //   }
    //   // });

    //   // try {
    //   // const { ChainType = chainType, Height, ID } = args;
    //   // if (!ID && !Height) {
    //   //   // throw new Error('Invalid Payload Parameter');
    //   //   throw new UserInputError('Invalid Payload Parameter');
    //   // }

    //   // Block.GetBlock({ ChainType, Height, ID }, (err, result) => {
    //   //   console.log('===err', err);
    //   //   if (err) {
    //   //     throw new Error('Err');
    //   //   }
    //   //   Converter.formatDataGRPC2(result);
    //   //   return result
    //   // });

    //   // Block.GetBlock({ ChainType, Height, ID }, (err, result) => {
    //   //   // console.log('===result', result);
    //   //   console.log('===err', err.details);
    //   //   if (err.details === 'BlockNotFound') {
    //   //     // throw new UserInputError('Block not found', { invalidArgs: Object.keys(args) });
    //   //     throw new Error('Invalid Payload Parameter');
    //   //   }
    //   // });

    //   // return new Promise((resolve, reject) => {
    //   //   if (!ID && !Height) {
    //   //     // throw new UserInputError('Invalid Payload Parameter');
    //   //     return reject('Invalid Payload Parameter');
    //   //   }

    //   //   // const cacheBlock = Converter.formatCache(cache.block, ID ? ID : Height);
    //   //   // RedisCache.get(cacheBlock, (errRedis, resRedis) => {
    //   //   //   if (errRedis) return reject(errRedis);
    //   //   //   if (resRedis && ID && resRedis.ID === ID) return resolve(resRedis);
    //   //   //   if (resRedis && Height && resRedis.Height === Height) return resolve(resRedis);

    //   //   Block.GetBlock({ ChainType, Height, ID }, (err, result) => {
    //   //     // console.log('===result', result);
    //   //     console.log('===err', err);
    //   //     if (err && err.details === 'BlockNotFound') {
    //   //       throw new Error('Blcok not found');
    //   //       // throw new ForbiddenError(`Block not found`);
    //   //       // reject('Block not found')
    //   //       // return reject('Block not found');
    //   //     }

    //   //     // if (err.details !== 'BlockNotFound') return reject(err.details);
    //   //     if (err) return reject(err);
    //   //     if (result) {
    //   //       Converter.formatDataGRPC2(result);
    //   //       return resolve(result);
    //   //       // RedisCache.set(cacheBlock, result, errRedis => {
    //   //       //   if (errRedis) return reject(errRedis);
    //   //       //   return resolve(result);
    //   //       // });
    //   //     }
    //   //   });
    //   // });
    //   // });
    //   // } catch (error) {
    //   //   throw new ForbiddenError(`Get Block Error: ${error.message}`);
    //   // }
    // }),
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
