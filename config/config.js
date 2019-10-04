const path = require('path');

module.exports = {
  app: {
    port: 6969,
    host: process.env.HOST || 'localhost',
    mainRoute: '/zoobc/api/v1',
    modeServer: 'http',
    modeCluster: true,
    redisExpired: 60 /** seconds */,
    scheduler: true,
    scheduleEvent: 30 /** seconds */,
    openSslKeyPath: process.env.SSL_KEYPATH,
    openSslCertPath: process.env.SSL_CERTPATH,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
  },
  db: {
    port: 27017,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  proto: {
    host: `${process.env.PROTO_HOST}:${process.env.PROTO_PORT}`,
    path: path.resolve(__dirname, '../schema'),
  },
};
