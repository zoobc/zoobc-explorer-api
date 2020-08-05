const { Converter, RedisCache } = require('../../utils')
const cache = { maps: 'maps' }

module.exports = {
  Query: {
    maps: (parent, args, { models }) => {
      const { CountryCode, RegistrationStatus } = args

      let where = {}
      if (CountryCode) where.CountryCode = CountryCode
      if (RegistrationStatus) where.RegistrationStatus = RegistrationStatus

      return new Promise((resolve, reject) => {
        const cacheMaps = Converter.formatCache(cache.maps, args)
        RedisCache.get(cacheMaps, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Nodes.find()
            .where(where)
            .select()
            .lean()
            .exec((err, data) => {
              if (err) return reject(err)

              RedisCache.set(cacheMaps, data, err => {
                if (err) return reject(err)
                return resolve(data)
              })
            })
        })
      })
    },
  },
}
