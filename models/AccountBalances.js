const config = require('../config/config');
const { createClient } = require('grpc-pack');

const AccountBalances = createClient(
  {
    protoPath: config.proto.path,
    protoName: 'accountBalance.proto',
    servicePath: 'service',
    serviceName: 'AccountBalancesService',
  },
  config.proto.host
);

module.exports = AccountBalances;
