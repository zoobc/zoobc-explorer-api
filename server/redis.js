const redis = require('redis');
const chalk = require('chalk');
const { msg } = require('../utils');

const redisClient = redis.createClient();
redisClient
  .once('ready', () => {
    // msg.green('🚀', 'Redis client connection success');
    console.log(chalk.green('🚀 Redis client connection success'));
  })
  .on('error', error => {
    msg.red('❌', `Redis connection error.\n${error}`);
  });

module.exports = () => redisClient;
