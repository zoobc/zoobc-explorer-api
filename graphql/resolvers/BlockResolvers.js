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
            { ChainType: args.ChainType, Limit: args.Limit, Height: args.Height },
            (err, result) => {
              if (err) return reject(err);
              const { blocks = null } = result;
              Converter.formatDataGRPC(blocks);
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
