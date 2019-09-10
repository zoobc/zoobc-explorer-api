const Redis = require('ioredis');
const redis = new Redis();

var RedisCache = {
  get,
  set,
};

async function get(key, callback) {
  try {
    const data = await redis.get(key);
    callback(null, data ? JSON.parse(data) : null);
  } catch (error) {
    callback(error, null);
  }
}

async function set(key, data, callback) {
  try {
    await redis.set(key, JSON.stringify(data));
    callback(null, true);
  } catch (error) {
    callback(error, null);
  }
}

module.exports = RedisCache;
