const config = require('../config/config');
const { createClient } = require('grpc-pack');

const Block = createClient(
  {
    protoPath: config.proto.path,
    protoName: 'block.proto',
    servicePath: 'service',
    serviceName: 'BlockService',
  },
  config.proto.host
);

const Transaction = createClient(
  {
    protoPath: config.proto.path,
    protoName: 'transaction.proto',
    servicePath: 'service',
    serviceName: 'TransactionService',
  },
  config.proto.host
);

module.exports = { Block, Transaction };
