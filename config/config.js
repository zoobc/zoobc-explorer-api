const path = require('path');

module.exports = {
  app: {
    port: 6969,
    host: process.env.HOST || 'localhost',
    mainRoute: '/zoobc/api/v1',
    modeServer: 'http',
    modeCluster: true,
    modeRedis: true,
    openSslKeyPath: './key.pem',
    openSslCertPath: './cert.pem',
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  proto: {
    host: '18.139.3.139:7000',
    path: path.resolve(__dirname, '../zoobc-schema'),
  },
};
