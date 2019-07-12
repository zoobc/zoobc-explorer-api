const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Block } = require('../../models');
const { Converter } = require('../../utils');

module.exports = {
  Query: {
    block: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          Block.GetBlocks(
            { BlockSize: args.BlockSize, BlockHeight: args.BlockHeight },
            (err, result) => {
              if (err) return reject(err);
              const { Blocks = null } = result;
              Converter.formatDataGRPC(Blocks);
              resolve(result);
            }
          );
        });
      } catch (error) {
        throw new ForbiddenError('Get Block Error:', error);
      }
    }),
  },
};
