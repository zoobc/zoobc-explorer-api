const { Converter, RedisCache } = require('../../utils')
const pageLimit = require('../../config/config').app.pageLimit
const cache = {
  nodes: 'nodes',
  node: 'node',
}

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' }
  }
  return { [string]: 'asc' }
}

module.exports = {
  Query: {
    nodes: (parent, args, { models }) => {
      const { page, limit, order, AccountAddress, RegistrationStatus } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { RegisteredBlockHeight: 'desc' }

      let where = {}
      if (AccountAddress !== undefined) {
        where.OwnerAddress = AccountAddress
      }
      if (RegistrationStatus !== undefined) {
        if (RegistrationStatus < 3) {
          where.RegistrationStatus = RegistrationStatus
        }
      }

      return new Promise((resolve, reject) => {
        const cacheNodes = Converter.formatCache(cache.nodes, args)
        RedisCache.get(cacheNodes, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Nodes.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err)

            models.Nodes.where(where).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err)

              models.Nodes.find()
                .where(where)
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err)

                  const result = {
                    Nodes: data,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: where ? totalWithFilter : totalWithoutFilter,
                    },
                  }

                  RedisCache.set(cacheNodes, result, err => {
                    if (err) return reject(err)
                    return resolve(result)
                  })
                })
            })
          })
        })
      })
    },

    node: (parent, args, { models }) => {
      const { NodeID, NodePublicKey } = args

      return new Promise((resolve, reject) => {
        const cacheNode = Converter.formatCache(cache.node, args)
        RedisCache.get(cacheNode, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          const where = NodeID ? { NodeID } : { NodePublicKeyFormatted: NodePublicKey }
          models.Nodes.findOne()
            .where(where)
            .lean()
            .exec((err, result) => {
              if (err) return reject(err)
              if (!result) return resolve({})

              RedisCache.set(cacheNode, result, err => {
                if (err) return reject(err)
                return resolve(result)
              })
            })
        })
      })
    },
  },
}
