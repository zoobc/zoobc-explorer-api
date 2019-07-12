const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Transaction } = require('../../models');
const { Converter } = require('../../utils');

module.exports = {
  Query: {
    transactions: combineResolvers(async (parent, args, context, info) => {
      try {
        return new Promise((resolve, reject) => {
          if (args.BlockID) {
            Transaction.GetTransactionsByBlockID({ BlockID: args.BlockID }, (err, result) => {
              if (err) return reject(err);
              const { Transactions = null } = result;
              Converter.formatDataGRPC(Transactions);
              resolve(Transactions);
            });
          } else {
            Transaction.GetTransactionsByAccountPublicKey(
              { AccountPublicKey: args.AccountPublicKey },
              (err, result) => {
                if (err) return reject(err);
                const { Transactions = null } = result;
                Converter.formatDataGRPC(Transactions);
                resolve(Transactions);
              }
            );
          }
        });
      } catch (error) {
        throw new ForbiddenError('Get Transactions Error:', error);
      }
    }),
  },
};
