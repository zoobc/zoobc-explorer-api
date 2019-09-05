const { Block, Transaction } = require('../../models');
const { Converter } = require('../../utils');

module.exports = class SearchService {
  constructor() {
    this.block = Block;
    this.transaction = Transaction;
  }

  async getOneBlock(id, callback) {
    try {
      this.block.GetBlock({ ID: id }, async (err, result) => {
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

  async getOneTransaction(id, callback) {
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
};
