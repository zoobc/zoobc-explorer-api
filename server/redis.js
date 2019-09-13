const redis = require('redis');
const chalk = require('chalk');

const redisClient = redis.createClient();
redisClient.on('ready', error => {
  error
    ? console.error('%s Redis connection error\n%s', chalk.red('🚀'), error)
    : console.log('%s Redis client connection success', chalk.green('🚀'));
});

module.exports = () => redisClient;
