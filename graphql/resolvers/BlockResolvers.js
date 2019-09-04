const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Block } = require('../../models');
const { Converter } = require('../../utils');

const chainType = 0;
const limit = 10;
const height = 1;

module.exports = {
  Query: {
    blocks: combineResolvers(async (parent, args, context, info) => {
      try {
        const { ChainType = chainType, Limit = limit, Height = height } = args;

        return new Promise((resolve, reject) => {
          Block.GetBlocks({ ChainType, Limit, Height }, (err, result) => {
            if (err) return reject(err);
            const { Blocks = null } = result;
            Converter.formatDataGRPC(Blocks);
            resolve(result);
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
          Block.GetBlock({ ChainType, ID, Height }, (err, result) => {
            if (err) return reject(err);
            Converter.formatDataGRPC2(result);
            resolve(result);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Block Error:', error);
      }
    }),
  },
};
