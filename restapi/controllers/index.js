const BlockController = require('./BlockController');
const TransactionController = require('./TransactionController');
const AccountBalancesController = require('./AccountBalancesController');
const PeersController = require('./PeersController');

module.exports = {
  blockController: new BlockController(),
  transactionController: new TransactionController(),
  accountBalancesController: new AccountBalancesController(),
  peersController: new PeersController(),
};
