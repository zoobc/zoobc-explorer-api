const { Transaction } = require('../../models');
const { Converter } = require('../../utils');

module.exports = class TransactionService {
  constructor() {
    this.transaction = Transaction;
  }

  getTransactionsByBlockID(blockID, callback) {
    this.transaction.GetTransactionsByBlockID({ BlockID: blockID }, (err, result) => {
      if (err) {
        callback(err.details, null);
        return;
      }

      Converter.formatDataGRPC(result.Transactions);
      callback(null, { data: result.Transactions });
    });
  }

  getTransactionsByAccountPublicKey(accPublicKey, callback) {
    const decodedData = Buffer.from(accPublicKey, 'base64');

    this.transaction.GetTransactionsByAccountPublicKey(
      { AccountPublicKey: decodedData },
      (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        Converter.formatDataGRPC(result.Transactions);
        callback(null, { data: result.Transactions });
      }
    );
  }

  getTransactionsTypeGraph(blockID, callback) {
    this.transaction.GetTransactionsByBlockID({ BlockID: blockID }, (err, result) => {
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

  async findAll({ blockID, accPublicKey }, callback) {
    try {
      if (accPublicKey) {
        this.getTransactionsByAccountPublicKey(accPublicKey, callback);
      } else {
        this.getTransactionsByBlockID(blockID, callback);
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  async transStat({ senderPublicKey, recipientPublicKey, blockID, accPublicKey }, callback) {
    try {
      if (blockID) {
        this.getTransactionsByBlockID(blockID, async (err, res) => {
          if (err) {
            callback(err.details, null);
            return;
          }

          const result = await this.filterData(res.data, senderPublicKey, recipientPublicKey);
          callback(null, result);
        });
      } else {
        this.getTransactionsByAccountPublicKey(accPublicKey, async (err, res) => {
          if (err) {
            callback(err.details, null);
            return;
          }

          const result = await this.filterData(res.data, senderPublicKey, recipientPublicKey);
          callback(null, result);
        });
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

  async graph({ blockID }, callback) {
    try {
      this.getTransactionsTypeGraph(blockID, callback);
    } catch (error) {
      throw Error(error.message);
    }
  }
};
