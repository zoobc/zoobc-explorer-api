const config = require('../config/config')
const redisClient = require('../modules/redis')()

var RedisCache = { get, set }

function get(key, callback) {
  try {
    redisClient.get(key, (err, result) => {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, result ? JSON.parse(result) : null)
    })
  } catch (error) {
    callback(error, null)
  }
}

function set(key, data, callback) {
  try {
    redisClient.setex(key, config.app.redisExpired, JSON.stringify(data), callback)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = RedisCache
