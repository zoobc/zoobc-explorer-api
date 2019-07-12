const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Converter } = require('../../utils');
const { AccountBalances } = require('../../models');

module.exports = {
  Query: {
    accountBalances: combineResolvers(async () => {
      try {
        return new Promise((resolve, reject) => {
          AccountBalances.GetAccountBalances({}, (err, result) => {
            if (err) return reject(err);
            const { AccountBalances = null } = result;
            Converter.formatDataGRPC(AccountBalances);
            resolve(AccountBalances);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Account Balances Error:', error);
      }
    }),

    accountBalance: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          AccountBalances.GetAccountBalance({ PublicKey: args.PublicKey }, (err, result) => {
            if (err) return reject(err);
            result.PublicKey = Buffer.from(result.PublicKey).toString('base64');
            resolve(result);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Account Balance Error:', error);
      }
    }),
  },
};
