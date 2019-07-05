const redis = require('redis');
const chalk = require('chalk');

const clientRedis = redis.createClient();
const config = require('../config/config');

module.exports = () => {
  if (config.app.modeRedis) {
    clientRedis.on('ready', err => {
      err
        ? console.error('%s Redis connection error', err, chalk.red('🚀')) // eslint-disable-line no-console
        : console.log('%s Redis client connection success', chalk.green('🚀')); // eslint-disable-line no-console
    });
  }
};
