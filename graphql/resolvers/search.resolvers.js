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

const cache = {
  searchTransaction: 'searchTransaction',
  searchBlock: 'searchBlock',
  searchAccount: 'searchAccount',
  searchNode: 'searchNode',
  searchPromotion: 'searchPromotion',
}

module.exports = {
  Query: {
    search: (parent, args, { models }) => {
      const { Id } = args

      return new Promise((resolve, reject) => {
        const cacheBlock = Converter.formatCache(cache.searchBlock, args)
        RedisCache.get(cacheBlock, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          let criteria
          const checkId = Number(Id)

          if (typeof checkId === 'number' && isNaN(checkId)) {
            criteria = Id !== undefined ? { $or: [{ BlockHashFormatted: Id }, { PreviousBlockIDFormatted: Id }] } : {}
          } else {
            criteria = Id !== undefined ? { $or: [{ BlockID: Id }, { Height: Id }] } : {}
          }

          models.Blocks.findOne()
            .where(criteria)
            .lean()
            .exec((err, block) => {
              if (err) return reject(err)
              if (block) {
                const resBlock = {
                  ID: block.BlockID,
                  Height: block.Height,
                  Timestamp: block.Timestamp,
                  FoundIn: 'Block',
                }

                RedisCache.set(cacheBlock, resBlock, err => {
                  if (err) return reject(err)
                  return resolve(resBlock)
                })
              } else {
                const cacheTransaction = Converter.formatCache(cache.searchTransaction, args)
                RedisCache.get(cacheTransaction, (err, resRedis) => {
                  if (err) return reject(err)
                  if (resRedis) return resolve(resRedis)

                  criteria = {
                    $or: [
                      { TransactionID: Id },
                      { TransactionHashFormatted: Id },
                      // { 'NodeRegistration.NodePublicKey': Id },
                      // { 'UpdateNodeRegistration.NodePublicKey': Id },
                      // { 'RemoveNodeRegistration.NodePublicKey': Id },
                      // { 'ClaimNodeRegistration.NodePublicKey': Id },
                    ],
                  }

                  models.Transactions.findOne()
                    .where(criteria)
                    .lean()
                    .exec((err, transaction) => {
                      if (err) return reject(err)
                      if (transaction) {
                        const resTrx = {
                          ID: transaction.TransactionID,
                          Height: transaction.Height,
                          Timestamp: transaction.Timestamp,
                          FoundIn: 'Transaction',
                        }

                        RedisCache.set(cacheTransaction, resTrx, err => {
                          if (err) return reject(err)
                          return resolve(resTrx)
                        })
                      } else {
                        const cacheAccount = Converter.formatCache(cache.searchAccount, args)
                        RedisCache.get(cacheAccount, (err, resRedis) => {
                          if (err) return reject(err)
                          if (resRedis) return resolve(resRedis)

                          models.Accounts.findOne()
                            .where({ AccountAddressFormatted: Id })
                            .lean()
                            .exec((err, account) => {
                              if (err) return reject(err)

                              if (account) {
                                const resAccount = {
                                  ID: account.AccountAddressFormatted,
                                  Height: null,
                                  Timestamp: null,
                                  FoundIn: 'Account',
                                }
                                RedisCache.set(cacheAccount, resAccount, err => {
                                  if (err) return reject(err)
                                  return resolve(resAccount)
                                })
                              } else {
                                const cacheNode = Converter.formatCache(cache.searchNode, args)
                                RedisCache.get(cacheNode, (err, resRedis) => {
                                  if (err) return reject(err)
                                  if (resRedis) return resolve(resRedis)

                                  models.Nodes.findOne()
                                    .where({ NodePublicKeyFormatted: Id })
                                    .lean()
                                    .exec((err, node) => {
                                      if (err) return reject(err)

                                      if (node) {
                                        const resNode = {
                                          ID: node.NodePublicKeyFormatted,
                                          Height: node.Height,
                                          Timestamp: node.RegistrationTime,
                                          FoundIn: 'Node',
                                        }
                                        RedisCache.set(cacheNode, resNode, err => {
                                          if (err) return reject(err)
                                          return resolve(resNode)
                                        })
                                      } else {
                                        models.Keywords.findOne({
                                          Keyword: { $regex: Id.toLowerCase(), $options: 'i' },
                                        })
                                          .populate('Admin')
                                          .lean()
                                          .exec((err, promotion) => {
                                            if (err) return reject(err)
                                            if (!promotion) return resolve({})

                                            const resPromotion = {
                                              ID: promotion._id,
                                              Height: 0,
                                              Timestamp: promotion.CreatedAt,
                                              FoundIn: 'Promotion',
                                              Promotion: promotion,
                                            }
                                            return resolve(resPromotion)
                                          })
                                      }
                                    })
                                })
                              }
                            })
                        })
                      }
                    })
                })
              }
            })
        })
      })
    },
  },
}
