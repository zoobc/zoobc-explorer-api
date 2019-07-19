const BlockController = require('./BlockController');
const TransactionController = require('./TransactionController');

module.exports = {
  blockController: new BlockController(),
  transactionController: new TransactionController(),
};
