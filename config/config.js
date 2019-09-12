const path = require('path');

module.exports = {
  app: {
    port: 6969,
    host: process.env.HOST || 'localhost',
    mainRoute: '/zoobc/api/v1',
    modeServer: 'http',
    modeCluster: true,
    modeRedis: true,
    redisStorageKey: 'zooBcExpl0rer4PI',
    scheduler: false,
    scheduleEvent: 1 /** minutes */,
    openSslKeyPath: process.env.SSL_KEYPATH,
    openSslCertPath: process.env.SSL_CERTPATH,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
  },
  db: {
    port: 27017,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  proto: {
    host: '18.139.3.139:7000',
    path: path.resolve(__dirname, '../zoobc-schema'),
  },
};
