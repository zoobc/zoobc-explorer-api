const Redis = require('ioredis');
const redis = new Redis();

module.exports = class RedisService {
  async get(key, callback) {
    try {
      const data = await redis.get(key);
      callback(null, data ? JSON.parse(data) : null);
    } catch (error) {
      callback(error, null);
    }
  }

  async set(key, data, callback) {
    try {
      await redis.set(key, JSON.stringify(data));
      callback(null, true);
    } catch (error) {
      callback(error, null);
    }
  }
};
