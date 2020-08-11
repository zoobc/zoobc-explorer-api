const { Converter, RedisCache } = require('../../utils')
const pageLimit = require('../../config/config').app.pageLimit
const { pubsub, events } = require('../subscription')

const cache = {
  blocks: 'blocks',
  block: 'block',
}

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' }
  }
  return { [string]: 'asc' }
}

module.exports = {
  Query: {
    blocks: (parent, args, { models }) => {
      const { page, limit, order, NodePublicKey } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' }
      const nodePublicKey = NodePublicKey !== undefined ? { BlocksmithID: NodePublicKey } : {}

      return new Promise((resolve, reject) => {
        const cacheBlocks = Converter.formatCache(cache.blocks, args)
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Blocks.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err)

            models.Blocks.where(nodePublicKey).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err)

              models.Blocks.find()
                .where(nodePublicKey)
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err)

                  const result = {
                    Blocks: data,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: nodePublicKey ? totalWithFilter : totalWithoutFilter,
                    },
                  }

                  RedisCache.set(cacheBlocks, result, err => {
                    if (err) return reject(err)
                    return resolve(result)
                  })
                })
            })
          })
        })
      })
    },

    block: (parent, args, { models }) => {
      const { BlockID } = args

      return new Promise((resolve, reject) => {
        const cacheBlock = Converter.formatCache(cache.block, args)
        RedisCache.get(cacheBlock, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          let criteria
          const checkId = Number(BlockID)

          if (typeof checkId === 'number' && isNaN(checkId)) {
            criteria = BlockID != null ? { BlockID: BlockID } : {}
          } else {
            criteria = BlockID != null ? { $or: [{ BlockID: BlockID }, { Height: BlockID }] } : {}
          }

          models.Blocks.findOne()
            .where(criteria)
            .lean()
            .exec((err, result) => {
              if (err) return reject(err)
              if (!result) return resolve({})

              RedisCache.set(cacheBlock, result, err => {
                if (err) return reject(err)
                return resolve(result)
              })
            })
        })
      })
    },
  },

  Mutation: {
    blocks: (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models.Blocks.find()
          .sort({ Height: -1, Timestamp: -1 })
          .limit(5)
          .select()
          .lean()
          .exec((err, blocks) => {
            if (err) return reject('failed publish blocks data')
            pubsub.publish(events.blocks, { blocks })
            return resolve('succesfully publish blocks data')
          })
      })
    },
  },

  Subscription: {
    blocks: {
      subscribe: () => pubsub.asyncIterator([events.blocks]),
    },
  },
}
