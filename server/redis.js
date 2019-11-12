const redis = require('redis');
const chalk = require('chalk');
const configRedis = require('../config/config').redis;

let options = { port: configRedis.port, host: configRedis.host };
if (configRedis.password !== '') {
  options.password = configRedis.password;
}
const redisClient = redis.createClient(options);
redisClient
  .once('ready', () => {
    console.log(chalk.green('🚀 Redis client connection success'));
  })
  .on('error', error => {
    console.log(chalk.red(`❌ Redis connection error.\n${error}`));
  });

module.exports = () => redisClient;
