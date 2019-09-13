const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
// const { Transaction } = require('../../models');
const { Converter } = require('../../utils');

const limit = 10;
const page = 1;

module.exports = {
  Query: {
    transactions: combineResolvers(async (parent, args, context, info) => {
      try {
        // const { Limit = limit, Page = page, AccountAddress } = args;
        // return new Promise((resolve, reject) => {
        //   Transaction.GetTransactions({ Limit, Page, AccountAddress }, (err, result) => {
        //     if (err) return reject(err);
        //     const { Transactions = null } = result;
        //     Converter.formatDataGRPC(Transactions);
        //     resolve(result);
        //   });
        // });
      } catch (error) {
        throw new ForbiddenError('Get Transactions Error:', error);
      }
    }),

    transaction: combineResolvers(async (parent, args, context, info) => {
      try {
        // const { ID } = args;
        // return new Promise((resolve, reject) => {
        //   Transaction.GetTransaction({ ID }, (err, result) => {
        //     if (err) return reject(err);
        //     Converter.formatDataGRPC2(result);
        //     resolve(result);
        //   });
        // });
      } catch (error) {
        throw new ForbiddenError('Get Transaction Error:', error);
      }
    }),
  },
};
