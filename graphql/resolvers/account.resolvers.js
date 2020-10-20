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
      const { page, limit, order, BlockHeight, refresh } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { BlockHeight: 'asc' }
      const blockHeight = BlockHeight !== undefined ? { BlockHeight } : {}
      const rfr = refresh !== undefined ? refresh : false

      return new Promise((resolve, reject) => {
        const cacheAccounts = Converter.formatCache(cache.accounts, args)
        RedisCache.get(cacheAccounts, (err, resRedis) => {
          if (err) return reject(err)

          if (resRedis && rfr === false) {
            return resolve(resRedis)
          } else if (!resRedis || rfr === true) {
            models.Accounts.countDocuments((err, totalWithoutFilter) => {
              if (err) return reject(err)

              models.Accounts.where(blockHeight).countDocuments((err, totalWithFilter) => {
                if (err) return reject(err)

                return models.Accounts.find()
                  .where(blockHeight)
                  .select()
                  .limit(lm)
                  .skip((pg - 1) * lm)
                  .sort(od)
                  .lean()
                  .exec((err, data) => {
                    if (err) return reject(err)

                    const result = {
                      Accounts: data,
                      Paginate: {
                        Page: parseInt(pg),
                        Count: data.length,
                        Total: blockHeight ? totalWithFilter : totalWithoutFilter,
                      },
                    }

                    RedisCache.set(cacheAccounts, result, err => {
                      if (err) return reject(err)
                      return resolve(result)
                    })
                  })
              })
            })
          }
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
