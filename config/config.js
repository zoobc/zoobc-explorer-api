const path = require('path');

module.exports = {
  app: {
    port: 6969,
    host: process.env.HOST || 'localhost',
    mainRoute: '/expspinechain/api/v1',
    modeServer: 'http',
    modeCluster: true,
    modeRedis: true,
    pidPath: '.zoobc.pid',
    openSslKeyPath: './key.pem',
    openSslCertPath: './cert.pem',
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  proto: {
    host: '18.139.3.139:8000',
    path: path.resolve(__dirname, '../spinechain-schema-prototype'),
  },
};
