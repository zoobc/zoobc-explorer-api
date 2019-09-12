const BlockController = require('./BlockController');
const TransactionController = require('./TransactionController');
const SearchController = require('./SearchController');

module.exports = {
  blockController: new BlockController(),
  transactionController: new TransactionController(),
  searchController: new SearchController(),
};
