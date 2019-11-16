const blockResolvers = require('./block.resolvers');
const transactionResolvers = require('./transaction.resolvers');
const accountResolvers = require('./account.resolvers');
const searchResolvers = require('./search.resolvers');
const nodeResolvers = require('./node.resolvers');
const publishedReceiptResolvers = require('./published.receipt.resolvers');
const graphResolvers = require('./graph.resolvers');

module.exports = [
  blockResolvers,
  transactionResolvers,
  accountResolvers,
  searchResolvers,
  nodeResolvers,
  publishedReceiptResolvers,
  graphResolvers,
];
