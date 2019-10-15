const BaseService = require('./BaseService');
const { Accounts, Blocks, Transactions, Nodes, AccountTransactions } = require('../../models');

module.exports = class ResetsService extends BaseService {
  resetAll(callback) {
    try {
      Blocks.deleteMany((err, res) => {
        if (err) return callback(err.message, null);
        // const nBlocks = res.deletedCount;

        Transactions.deleteMany((err, res) => {
          if (err) return callback(err.message, null);
          // const nTransactions = res.deletedCount;

          Nodes.deleteMany((err, res) => {
            if (err) return callback(err.message, null);
            // const nNodes = res.deletedCount;

            Accounts.deleteMany((err, res) => {
              if (err) return callback(err.message, null);
              // const nAccounts = res.deletedCount;

              AccountTransactions.deleteMany((err, res) => {
                if (err) return callback(err.message, null);
                // const nAccountTransactions = res.deletedCount;

                return callback(null, `Success reset all docs`);
              });
            });
          });
        });
      });
    } catch (error) {
      return callback(error.message, null);
    }
  }
};
