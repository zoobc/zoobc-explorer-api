const blockResolvers = require('./block.resolvers');
const transactionResolvers = require('./transaction.resolvers');
const accountResolvers = require('./account.resolvers');
const searchResolvers = require('./search.resolvers');

module.exports = [blockResolvers, transactionResolvers, accountResolvers, searchResolvers];
