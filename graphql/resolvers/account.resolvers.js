const { Converter, RedisCache } = require('../../utils')
const pageLimit = require('../../config/config').app.pageLimit
const cache = {
  accounts: 'accounts',
  account: 'account',
}

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' }
  }
  return { [string]: 'asc' }
}

module.exports = {
  Query: {
    accounts: (parent, args, { models }) => {
      const { page, limit, order } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { BlockHeight: 'asc' }

      return new Promise((resolve, reject) => {
        const cacheAccounts = Converter.formatCache(cache.accounts, args)
        RedisCache.get(cacheAccounts, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Accounts.countDocuments((err, total) => {
            if (err) return reject(err)

            return models.Accounts.find()
              .select()
              .limit(lm)
              .skip((pg - 1) * lm)
              .sort(od)
              .lean()
              .exec((err, data) => {
                if (err) return reject(err)
                const result = {
                  Accounts: data,
                  Paginate: { Page: parseInt(pg), Count: data.length, Total: total },
                }

                RedisCache.set(cacheAccounts, result, err => {
                  if (err) return reject(err)
                  return resolve(result)
                })
              })
          })
        })
      })
    },

    account: (parent, args, { models }) => {
      const { AccountAddress } = args

      return new Promise((resolve, reject) => {
        const cacheAccount = Converter.formatCache(cache.account, args)
        RedisCache.get(cacheAccount, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Accounts.findOne()
            .where({ AccountAddress: AccountAddress })
            .lean()
            .exec((err, result) => {
              if (err) return reject(err)
              if (!result) return resolve({})

              RedisCache.set(cacheAccount, result, err => {
                if (err) return reject(err)
                return resolve(result)
              })
            })
        })
      })
    },
  },
}
