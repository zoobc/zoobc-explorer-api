const blockResolvers = require('./block.resolvers');
const transactionResolvers = require('./transaction.resolvers');
const accountResolvers = require('./account.resolvers');

module.exports = [blockResolvers, transactionResolvers, accountResolvers];
