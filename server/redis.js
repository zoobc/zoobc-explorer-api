const redis = require('redis');
const chalk = require('chalk');
const configRedis = require('../config/config').redis;
const { msg } = require('../utils');

let options = { port: configRedis.port, host: configRedis.host };
if (configRedis.password !== '') {
  options.password = configRedis.password;
}
const redisClient = redis.createClient(options);
redisClient
  .once('ready', () => {
    // msg.green('🚀', 'Redis client connection success');
    console.log(chalk.green('🚀 Redis client connection success'));
  })
  .on('error', error => {
    msg.red('❌', `Redis connection error.\n${error}`);
  });

module.exports = () => redisClient;
