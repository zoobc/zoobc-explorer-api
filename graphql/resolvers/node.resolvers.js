/** 
 * ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
 * This file is part of ZooBC <https://github.com/zoobc/zoobc-explorer-api>

 * ZooBC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * ZooBC is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with ZooBC.  If not, see <http://www.gnu.org/licenses/>.

 * Additional Permission Under GNU GPL Version 3 section 7.
 * As the special exception permitted under Section 7b, c and e, 
 * in respect with the Author’s copyright, please refer to this section:

 * 1. You are free to convey this Program according to GNU GPL Version 3,
 *     as long as you respect and comply with the Author’s copyright by 
 *     showing in its user interface an Appropriate Notice that the derivate 
 *     program and its source code are “powered by ZooBC”. 
 *     This is an acknowledgement for the copyright holder, ZooBC, 
 *     as the implementation of appreciation of the exclusive right of the
 *     creator and to avoid any circumvention on the rights under trademark
 *     law for use of some trade names, trademarks, or service marks.

 * 2. Complying to the GNU GPL Version 3, you may distribute 
 *     the program without any permission from the Author. 
 *     However a prior notification to the authors will be appreciated.

 * ZooBC is architected by Roberto Capodieci & Barton Johnston
 * contact us at roberto.capodieci[at]blockchainzoo.com
 * and barton.johnston[at]blockchainzoo.com

 * IMPORTANT: The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
**/

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
}
