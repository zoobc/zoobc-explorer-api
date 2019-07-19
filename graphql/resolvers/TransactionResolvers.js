const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Transaction } = require('../../models');
const { Converter } = require('../../utils');

module.exports = {
  Query: {
    transactions: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          Transaction.GetTransactions({ Limit: args.Limit, Offset: args.Offset }, (err, result) => {
            if (err) return reject(err);
            const { Transactions = null } = result;
            Converter.formatDataGRPC(Transactions);
            resolve(Transactions);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Transactions Error:', error);
      }
    }),

    transaction: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          Transaction.GetTransaction({ ID: args.ID }, (err, result) => {
            if (err) return reject(err);
            Converter.formatDataGRPC2(result);
            resolve(result);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Transactions Error:', error);
      }
    }),
  },
};
