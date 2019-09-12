const BaseService = require('./BaseService');
const { Transactions } = require('../../models');

module.exports = class TransactionsService extends BaseService {
  constructor() {
    super(Transactions);
  }

  getLastHeight(callback) {
    Transactions.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }
};
