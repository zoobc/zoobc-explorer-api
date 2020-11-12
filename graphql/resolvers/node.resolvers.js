const { Converter, RedisCache } = require('../../utils')
const pageLimit = require('../../config/config').app.pageLimit
const { pubsub, events } = require('../subscription')

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

function parseOrder2(string) {
  if (string[0] === '-') {
    return `${string.slice(1)}`
  }
  return `${string}`
}

const nodesMapped = async (nodes, models, order = { Height: 'desc' }) => {
  const nodesMapped = []

  nodes &&
    nodes.length > 0 &&
    (await Promise.all(
      nodes.map(async node => {
        const totalNode = await models.Nodes.where({
          NodeID: node.NodeID,
        }).countDocuments()
        nodesMapped.push({
          ...node,
          TotalNode: totalNode,
        })
        return
      })
    ))

  return nodesMapped && nodesMapped.length > 0
    ? nodesMapped.sort((a, b) => {
        const orderFormatted = order !== undefined ? parseOrder2(order) : 'RegisteredBlockHeight'
        return order[0] === '-' ? b[orderFormatted] - a[orderFormatted] : a[orderFormatted] - b[orderFormatted]
      })
    : nodesMapped
}

module.exports = {
  Query: {
    nodes: (parent, args, { models }) => {
      const { page, limit, order, AccountAddress, RegistrationStatus, refresh } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { RegisteredBlockHeight: 'desc' }
      const rfr = refresh !== undefined ? refresh : false

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

          if (resRedis && rfr === false) {
            return resolve(resRedis)
          } else if (!resRedis || rfr === true) {
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
          }
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

  Mutation: {
    nodes: (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models.Nodes.find()
          .sort({ RegisteredBlockHeight: -1, RegistrationTime: -1 })
          .limit(5)
          .select()
          .lean()
          .exec((err, data) => {
            if (err) return reject(`failed to publish nodes data. It is caused by ${err}`)

            nodesMapped(data, models)
              .then(nodes => {
                if (nodes != null && nodes.length > 0) {
                  pubsub.publish(events.nodes, { nodes })
                  return resolve('succesfully publish nodes data')
                }
                return reject(`failed to publish nodes data. The data is empty.`)
              })
              .catch(err => reject(`failed to publish nodes data. It is caused by ${err}`))
          })
      })
    },
  },

  Subscription: {
    nodes: {
      subscribe: () => pubsub.asyncIterator([events.nodes]),
    },
  },
}
