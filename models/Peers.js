const config = require('../config/config');
const { createClient } = require('grpc-pack');

const Peers = createClient(
  {
    protoPath: config.proto.path,
    protoName: 'peer.proto',
    servicePath: 'service',
    serviceName: 'PeerService',
  },
  config.proto.host
);

module.exports = Peers;
