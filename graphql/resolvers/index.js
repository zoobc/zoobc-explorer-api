const BlockResolvers = require('./BlockResolvers');
const TransactionResolvers = require('./TransactionResolvers');
const AccountBalanceResolvers = require('./AccountBalanceResolvers');
const PeerResolvers = require('./PeerResolvers');

module.exports = [BlockResolvers, TransactionResolvers, AccountBalanceResolvers, PeerResolvers];
