const BlockController = require('./BlockController');
const TransactionController = require('./TransactionController');
const SearchController = require('./SearchController');
const AccountController = require('./AccountController');

module.exports = {
  blockController: new BlockController(),
  transactionController: new TransactionController(),
  searchController: new SearchController(),
  accountController: new AccountController(),
};
