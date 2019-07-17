const { Transaction } = require('../../models');
const { Converter } = require('../../utils');

module.exports = class TransactionService {
  constructor() {
    this.transaction = Transaction;
  }

  getTransactionsTypeGraph(limit, offSet) {
    this.transaction.GetTransaction({ Limit: limit, Offset: offSet }, (err, result) => {
      if (err) {
        callback(err.details, null);
        return;
      }

      const graph = {
        graph: [['Type', 'TransactionCount'], ['Ordinary Payment', 0], ['Node Registration', 0]],
      };

      const { Transactions } = result;
      Transactions.map(function(item) {
        Object.entries(item).forEach(([key, value]) => {
          if (key === 'Type' || key === 'Subtype') {
            item[key] = value[0];
          }
        });

        if (item.Type === 1 && item.Subtype === 0) {
          graph.graph[1][1] += 1;
        } else if (item.Type === 3 && item.Subtype === 0) {
          graph.graph[2][1] += 1;
        }
        return item;
      });

      callback(null, { data: graph });
    });
  }

  async transStat({ limit, offSet }, callback) {
    try {
      if (limit) {
        if (offSet){
          this.transaction.GetTransactions({ Limit: limit, Offset: offSet}, async (err, result) => {
            if (err) {
             callback(err.details, null);
             return;
            }
            callback(null, result);
          });
        } else {
          console.log('LIMIT EXIST NO OFFSET BUT ERROR')
          this.transaction.GetTransactions({ Limit: limit, Offset: 1}, async (err, result) => {
            if (err) {
              console.log('LIMIT EXIST NO OFFSET BUT ERROR-2')
              callback(err.details, null);
              return;
            }
            callback(null, result);
          });
        }
      } else {
        if (offSet){
          this.transaction.GetTransactions({ Limit: 1, Offset: offSet}, async (err, result) => {
            if (err) {
             callback(err.details, null);
             return;
            }
            callback(null, result);
          });
        } else {
          this.transaction.GetTransactions({ Limit: 1, Offset: 1}, async (err, result) => {
            if (err) {
              callback(err.details, null);
              return;
            }
            callback(null, result);
          });
        }
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  async filterData(arr, senderPublicKey, recipientPublicKey) {
    let result = [['Timestamp', 'AmountNQT']];
    arr.forEach(i => {
      if (typeof senderPublicKey !== 'undefined' && i.SenderPublicKey === senderPublicKey) {
        result.push([i.Timestamp, parseFloat(i.AmountNQT)]);
      }

      if (
        typeof recipientPublicKey !== 'undefined' &&
        i.RecipientPublicKey === recipientPublicKey
      ) {
        result.push([i.Timestamp, parseFloat(i.AmountNQT)]);
      }
    });
    return result;
  }

  async graph({ limit, offSet }, callback) {
    try {
      this.transaction.GetTransactions (limit, offSet);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getTransaction({ id }, callback) {
    try {
      this.transaction.GetTransactions({ ID: id}, async (err, result) => {
        if (err) {
         callback(err.details, null);
         return;
        }
        callback(null, result);
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
};
