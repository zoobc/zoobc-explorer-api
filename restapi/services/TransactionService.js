const { Transaction } = require('../../models');
const { Converter } = require('../../utils');
const moment = require('moment');

module.exports = class TransactionService {
  constructor() {
    this.transaction = Transaction;
  }

  async getAll({ Limit, Page, AccountAddress }, callback) {
    try {
      this.transaction.GetTransactions(
        { Limit: Limit, Page: Page, AccountAddress: AccountAddress },
        async (err, result) => {
          if (err) {
            callback(err.details, null);
            return;
          }
          const { Total, Transactions } = result;
          Converter.formatDataGRPC(Transactions);
          callback(null, {
            data: { Total, Transactions },
          });
        }
      );
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getOne(id, callback) {
    try {
      this.transaction.GetTransaction({ ID: id }, async (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }
        Converter.formatDataGRPC2(result);
        callback(null, result);
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async graphAmount({ Limit, Page, AccountAddress }, callback) {
    try {
      this.transaction.GetTransactions(
        { Limit: Limit, Page: Page, AccountAddress: AccountAddress },
        async (err, result) => {
          if (err) {
            callback(err.details, null);
            return;
          }

          const { Transactions } = result;

          let graph = [['Timestamp', 'Fee']];

          Transactions.forEach(i => {
            let timestampString = moment.unix(i.Timestamp).format('DD-MMM-YYYY HH:mm:ss');
            graph.push([timestampString, parseFloat(i.Fee)]);
          });

          callback(null, { data: graph });
        }
      );
    } catch (error) {
      throw Error(error.message);
    }
  }

  async graphType({ Limit, Page, AccountAddress }, callback) {
    try {
      this.transaction.GetTransactions(
        { Limit: Limit, Page: Page, AccountAddress: AccountAddress },
        async (err, result) => {
          if (err) {
            callback(err.details, null);
            return;
          }

          const { Transactions } = result;

          const graph = {
            graph: [
              ['Type', 'TransactionCount'],
              ['Ordinary Payment', 0],
              ['Node Registration', 0],
            ],
          };

          Transactions.map(function(item) {
            Object.entries(item).forEach(([key, value]) => {
              if (key === 'TransactionType') {
                item[key] = value[0];
              }
            });

            if (item.TransactionType === 1) {
              graph.graph[1][1] += 1;
            } else if (item.TransactionType === 3) {
              graph.graph[2][1] += 1;
            }
            return item;
          });

          callback(null, { data: graph });
        }
      );
    } catch (error) {
      throw Error(error.message);
    }
  }
};
