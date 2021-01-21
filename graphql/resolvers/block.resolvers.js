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

function parseOrder2(string) {
  if (string[0] === '-') {
    return `${string.slice(1)}`
  }
  return `${string}`
}

const blocksMapped = async (blocks, models, order = { Height: 'desc' }) => {
  const blocksMapped = []

  blocks &&
    blocks.length > 0 &&
    (await Promise.all(
      blocks.map(async block => {
        const totalTransaction = await models.Transactions.where({
          BlockID: block.BlockID,
        }).countDocuments()
        blocksMapped.push({
          ...block,
          TotalTransaction: totalTransaction,
        })
        return
      })
    ))

  return blocksMapped && blocksMapped.length > 0
    ? blocksMapped.sort((a, b) => {
        const orderFormatted = order !== undefined ? parseOrder2(order) : 'Height'
        return order[0] === '-' ? b[orderFormatted] - a[orderFormatted] : a[orderFormatted] - b[orderFormatted]
      })
    : blocksMapped
}

const getPopChanges = async (height, models) => {
  const participantScores = await models.ParticipationScores.find().where({ Height: height }).select().lean().exec()

  const participantScoresFiltered =
    participantScores &&
    participantScores.length > 0 &&
    participantScores.filter(item => {
      const score = Math.sign(parseFloat(item.Score))
      if (score === 0 || score === 1) return item
    })

  const participantScoresMapped = []

  participantScoresFiltered &&
    participantScoresFiltered.length > 0 &&
    (await Promise.all(
      participantScoresFiltered.map(async pop => {
        const node = await models.Nodes.findOne().where({ NodeID: pop.NodeID }).select().lean().exec()

        participantScoresMapped.push({
          ...pop,
          ...(node && {
            NodePublicKey: node.NodePublicKey,
            NodePublicKeyFormatted: node.NodePublicKeyFormatted,
          }),
        })
        return
      })
    ))

  return participantScoresMapped
}

const getAccountRewards = async (height, models) => {
  const accountLedgers = await models.AccountLedgers.find()
    .where({ BlockHeight: height })
    .select()
    .sort({ Timestamp: 'desc' })
    .lean()
    .exec()

  return accountLedgers
}

const getBlockByHeight = async (height, models) => {
  const block = await models.Blocks.findOne().where({ Height: height }).lean().exec()
  return block
}

module.exports = {
  Query: {
    blocks: (parent, args, { models }) => {
      const { page, limit, order, NodePublicKey, refresh } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { Height: 'desc' }
      const nodePublicKey = NodePublicKey !== undefined ? { BlocksmithID: NodePublicKey } : {}
      const rfr = refresh !== undefined ? refresh : false

      return new Promise((resolve, reject) => {
        const cacheBlocks = Converter.formatCache(cache.blocks, args)
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis && rfr === false) {
            return resolve(resRedis)
          } else if (!resRedis || rfr === true) {
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
                  .exec(async (err, data) => {
                    if (err) return reject(err)

                    blocksMapped(data, models, order)
                      .then(res => {
                        const result = {
                          Blocks: res,
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
                      .catch(err => reject(err))
                  })
              })
            })
          }
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
            criteria =
              BlockID !== undefined
                ? { $or: [{ BlockHashFormatted: BlockID }, { PreviousBlockIDFormatted: BlockID }] }
                : {}
          } else {
            criteria = BlockID !== undefined ? { $or: [{ BlockID: BlockID }, { Height: BlockID }] } : {}
          }

          models.Blocks.findOne()
            .where(criteria)
            .lean()
            .exec(async (err, result) => {
              if (err) return reject(err)
              if (!result) return resolve({})

              try {
                const PopChanges = await getPopChanges(result.Height, models)

                const AccountRewards = await getAccountRewards(result.Height, models)

                const block = {
                  ...result,
                  PopChanges,
                  AccountRewards,
                }

                const currentHeight = block.Height

                const previousBlock = await getBlockByHeight(currentHeight - 1, models)
                const previousHeight = previousBlock ? previousBlock.Height : 0

                const nextBlock = await getBlockByHeight(currentHeight + 1, models)
                const nextHeight = nextBlock ? nextBlock.Height : currentHeight + 1

                const finalResult = {
                  Block: block,
                  NextPrevious: {
                    Previous: {
                      Enabled: previousBlock ? true : false,
                      Height: previousHeight,
                      BlockHashFormatted: previousBlock ? previousBlock.BlockHashFormatted : '',
                    },
                    Next: {
                      Enabled: nextBlock ? true : false,
                      Height: nextHeight,
                      BlockHashFormatted: nextBlock ? nextBlock.BlockHashFormatted : '',
                    },
                  },
                }

                RedisCache.set(cacheBlock, finalResult, err => {
                  if (err) return reject(err)
                  return resolve(finalResult)
                })
              } catch (error) {
                return reject(error)
              }
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
          .exec((err, data) => {
            if (err) return reject(`failed to publish blocks data. It is caused by ${err}`)

            blocksMapped(data, models)
              .then(blocks => {
                if (blocks != null && blocks.length > 0) {
                  pubsub.publish(events.blocks, { blocks })
                  return resolve('succesfully publish blocks data')
                }
                return reject(`failed to publish blocks data. The data is empty.`)
              })
              .catch(err => reject(`failed to publish blocks data. It is caused by ${err}`))
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
