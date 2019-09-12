const redis = require('redis');
const chalk = require('chalk');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const redisClient = redis.createClient();
const config = require('../config/config');

module.exports = app => {
  if (config.app.modeRedis) {
    redisClient.on('ready', err => {
      err
        ? console.error('%s Redis connection error', err, chalk.red('🚀'))
        : console.log('%s Redis client connection success', chalk.green('🚀'));
    });

    app.use(
      session({
        resave: false,
        name: '_ZoobcAPI',
        saveUninitialized: true,
        cookie: { secure: false },
        secret: config.app.redisStorageKey,
        store: new redisStore({ host: config.app.host, port: 6379, client: redisClient, ttl: 3600 }),
      })
    );
  }
};
