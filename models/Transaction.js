const config = require('../config/config');
const { createClient } = require('grpc-pack');

const Transaction = createClient(
  {
    protoPath: config.proto.path,
    protoName: 'transaction.proto',
    servicePath: 'service',
    serviceName: 'TransactionService',
  },
  config.proto.host
);

module.exports = Transaction;
