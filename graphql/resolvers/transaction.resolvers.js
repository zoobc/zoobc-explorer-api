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
  transactions: 'transactions',
  transaction: 'transaction',
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

const formatRecipientData = value => {
  return value ===
    '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000'
    ? ''
    : value
}

const multisigFormatObject = i => {
  return {
    ...i,
    Recipient: formatRecipientData(i.Recipient),
    ...(i.MultiSignature && {
      MultiSignature: {
        ...i.MultiSignature,
        SignatureInfo: {
          ...(i.MultiSignature.SignatureInfo && {
            ...i.MultiSignature.SignatureInfo,
            ...(i.MultiSignature.SignatureInfo.Signatures && {
              Signatures: Object.entries(i.MultiSignature.SignatureInfo.Signatures).map(([key, value]) => {
                return {
                  Address: key,
                  Signature: value,
                }
              }),
            }),
          }),
        },
      },
    }),
  }
}

const multisigMapping = multisig => {
  if (multisig && multisig.length < 1) return []
  return multisig && multisig.length > 0 && multisig.map(i => multisigFormatObject(i))
}

const groupingMultisig = async (models, trx, order) => {
  const multisig = await models.Transactions.find()
    .where({
      'MultiSignature.SignatureInfo.TransactionHash': trx.TransactionHash,
    })
    .select()
    .sort(order)
    .lean()
    .exec()

  const multisigMapped = multisigMapping(multisig)
  // const status = multisigMapped && multisigMapped.length > 0 && setMultisigStatus(multisigMapped)

  return {
    ...trx,
    // Status: status,
    MultiSignatureTransactions: multisigMapped,
    ...(multisigMapped.length > 0 && {
      MultiSignature: multisigMapped[0].MultiSignature,
    }),
  }
}

const singleMultisig = async (models, trx) => {
  const trxHash =
    trx.MultiSignature && trx.MultiSignature.SignatureInfo && trx.MultiSignature.SignatureInfo.TransactionHash

  const parent = await models.Transactions.findOne().where({ TransactionHash: trxHash }).select().lean().exec()

  if (parent === null || parent === undefined) {
    const childMapped = multisigFormatObject(trx)

    return {
      ...childMapped,
    }
  }

  return null
}

module.exports = {
  Query: {
    transactions: (parent, args, { models }) => {
      const { page, limit, order, BlockID, AccountAddress, refresh } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { Timestamp: 'desc' }
      const blockId = BlockID !== undefined ? { BlockID } : null
      const accountAddress =
        AccountAddress !== undefined
          ? { $or: [{ SenderFormatted: AccountAddress }, { RecipientFormatted: AccountAddress }] }
          : null
      const rfr = refresh !== undefined ? refresh : false

      const criteria = {
        $and: [blockId ? blockId : accountAddress ? accountAddress : {}, { TransactionType: { $nin: [4] } }],
      }

      const getTransactions = async () => {
        const transactions = await models.Transactions.find()
          .where(criteria)
          .select()
          .limit(lm)
          .skip((pg - 1) * lm)
          .sort(od)
          .lean()
          .exec()

        const result = []

        transactions &&
          transactions.length > 0 &&
          (await Promise.all(
            transactions.map(async trx => {
              if (trx.TransactionType === 1 && trx.MultisigChild === true) {
                const multisigGrouped = await groupingMultisig(models, trx, od)
                result.push(multisigGrouped)
                return
              }

              if (trx.TransactionType === 5) {
                const multisig = await singleMultisig(models, trx)
                if (multisig !== null) {
                  result.push(multisig)
                  return
                }
                return
              }

              if (trx.Escrow != null) {
                const escrow = await models.Transactions.findOne()
                  .where({
                    'ApprovalEscrow.TransactionID': trx.TransactionID,
                  })
                  .select()
                  .lean()
                  .exec()

                result.push({
                  ...trx,
                  ...(escrow && {
                    Status: escrow.Status,
                  }),
                  EscrowTransaction: escrow && {
                    ...escrow,
                    Recipient: formatRecipientData(escrow.Recipient),
                  },
                })
                return
              }

              result.push({
                ...trx,
                Recipient: formatRecipientData(trx.Recipient),
                Status: trx.TransactionType === 1 && trx.Escrow === null ? 'Approved' : trx.Status,
              })
            })
          ))

        if (result && result.length > 0) {
          // const resultMapped = result.map(i => {
          //   if (i.MultiSignatureTransactions != null && i.MultiSignatureTransactions.length > 0) {
          //     const status = setMultisigStatus(i.MultiSignatureTransactions)

          //     return {
          //       ...i,
          //       Status: status,
          //     }
          //   }
          //   return i
          // })

          return result.sort((a, b) => {
            const orderFormatted = order !== undefined ? parseOrder2(order) : 'Timestamp'
            return order[0] === '-' ? b[orderFormatted] - a[orderFormatted] : a[orderFormatted] - b[orderFormatted]
          })
        } else {
          return result
        }
      }

      return new Promise((resolve, reject) => {
        const cacheTransactions = Converter.formatCache(cache.transactions, args)
        RedisCache.get(cacheTransactions, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis && rfr === false) {
            return resolve(resRedis)
          } else if (!resRedis || rfr === true) {
            models.Transactions.where({ TransactionType: { $nin: [4] } }).countDocuments((err, totalWithoutFilter) => {
              if (err) return reject(err)

              models.Transactions.where(criteria).countDocuments((err, totalWithFilter) => {
                if (err) return reject(err)

                getTransactions()
                  .then(res => {
                    const result = {
                      Transactions: res,
                      Paginate: {
                        Page: parseInt(pg),
                        Count: res.length,
                        Total: blockId || accountAddress ? totalWithFilter : totalWithoutFilter,
                      },
                    }
                    RedisCache.set(cacheTransactions, result, err => {
                      if (err) return reject(err)
                      return resolve(result)
                    })
                  })
                  .catch(err => reject(err))
              })
            })
          }
        })
      })
    },

    transaction: (parent, args, { models }) => {
      const { TransactionID } = args

      const criteria = {
        $or: [{ TransactionID: TransactionID }, { TransactionHashFormatted: TransactionID }],
      }

      const getTransaction = async () => {
        const trx = await models.Transactions.findOne().where(criteria).select().lean().exec()

        if (!trx) return {}

        if (trx.TransactionType === 1 && trx.MultisigChild === true) {
          const multisigGrouped = await groupingMultisig(models, trx, { Timestamp: 'desc' })
          return multisigGrouped
        }

        if (trx.TransactionType === 5) {
          const multisig = multisigFormatObject(trx)
          return multisig
        }

        if (trx.Escrow != null) {
          const escrow = await models.Transactions.findOne()
            .where({ 'ApprovalEscrow.TransactionID': trx.TransactionID })
            .select()
            .lean()
            .exec()

          return {
            ...trx,
            ...(escrow && {
              Status: escrow.Status,
            }),
            EscrowTransaction: escrow && {
              ...escrow,
              Recipient: formatRecipientData(escrow.Recipient),
            },
          }
        }

        return {
          ...trx,
          Recipient: formatRecipientData(trx.Recipient),
          Status: trx.TransactionType === 1 && trx.Escrow === null ? 'Approved' : trx.Status,
        }
      }

      return new Promise((resolve, reject) => {
        const cacheTransaction = Converter.formatCache(cache.transaction, args)
        RedisCache.get(cacheTransaction, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          getTransaction()
            .then(result => {
              RedisCache.set(cacheTransaction, result, err => {
                if (err) return reject(err)
                return resolve(result)
              })
            })
            .catch(err => reject(err))
        })
      })
    },
  },

  Transaction: {
    Block: async (transaction, args, { models }) => {
      return await models.Blocks.findOne({ BlockID: transaction.BlockID }).lean()
    },
  },

  Mutation: {
    transactions: (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models.Transactions.find()
          .sort({ Timestamp: -1 })
          .limit(5)
          .select()
          .lean()
          .exec((err, transactions) => {
            if (err) return reject(`failed to publish transactions data. It is caused by ${err}`)

            if (transactions != null && transactions.length > 0) {
              pubsub.publish(events.transactions, { transactions })
              return resolve('succesfully publish transactions data')
            }

            return reject(`failed to publish transactions data. The data is empty.`)
          })
      })
    },
  },

  Subscription: {
    transactions: {
      subscribe: () => pubsub.asyncIterator([events.transactions]),
    },
  },
}
