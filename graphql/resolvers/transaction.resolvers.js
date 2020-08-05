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

module.exports = {
  Query: {
    transactions: (parent, args, { models }) => {
      const { page, limit, order, BlockID, AccountAddress } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { Height: 'desc' }
      const blockId = BlockID !== undefined ? { BlockID } : null
      const accountAddress =
        AccountAddress !== undefined ? { $or: [{ Sender: AccountAddress }, { Recipient: AccountAddress }] } : null

      const criteria = {
        $and: [blockId ? blockId : accountAddress ? accountAddress : {}, { TransactionType: { $nin: [4, 5] } }],
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
              if (trx.MultisigChild === true) {
                const multisig = await models.Transactions.find()
                  .where({
                    'MultiSignature.SignatureInfo.TransactionHash': trx.TransactionHash,
                  })
                  .select()
                  .sort(od)
                  .lean()
                  .exec()

                const multisigMapped =
                  multisig &&
                  multisig.length > 0 &&
                  multisig.map(i => {
                    return {
                      ...i,
                      ...(i.MultiSignature && {
                        MultiSignature: {
                          ...i.MultiSignature,
                          SignatureInfo: {
                            ...(i.MultiSignature.SignatureInfo && {
                              ...i.MultiSignature.SignatureInfo,
                              ...(i.MultiSignature.SignatureInfo.Signatures && {
                                Signatures: Object.entries(i.MultiSignature.SignatureInfo.Signatures).map(
                                  ([key, value]) => {
                                    return {
                                      Address: key,
                                      Signature: value,
                                    }
                                  }
                                ),
                              }),
                            }),
                          },
                        },
                      }),
                    }
                  })

                result.push({
                  ...trx,
                  MultiSignatureTransactions: multisigMapped,
                  ...(multisigMapped.length > 0 && {
                    MultiSignature: multisigMapped[0].MultiSignature,
                  }),
                })

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
                  EscrowTransaction: escrow && { ...escrow },
                })
                return
              }

              result.push({
                ...trx,
                Status:
                  (trx.TransactionType === 1 && trx.MultisigChild === false) ||
                  (trx.TransactionType === 1 && trx.Escrow === null)
                    ? 'Approved'
                    : trx.Status,
              })
            })
          ))

        return result.sort((a, b) => {
          const orderFormatted = order !== undefined ? parseOrder2(order) : 'Height'
          return a[orderFormatted] > b[orderFormatted] ? -1 : 1
        })
      }

      return new Promise((resolve, reject) => {
        const cacheTransactions = Converter.formatCache(cache.transactions, args)
        RedisCache.get(cacheTransactions, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Transactions.where({ TransactionType: { $nin: [4, 5] } }).countDocuments((err, totalWithoutFilter) => {
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
        })
      })
    },

    transaction: (parent, args, { models }) => {
      const { TransactionID } = args

      const criteria = {
        $or: [{ TransactionID: TransactionID }, { TransactionHash: Buffer.from(TransactionID, 'base64') }],
      }

      const getTransaction = async () => {
        const trx = await models.Transactions.findOne().where(criteria).select().lean().exec()

        if (!trx) return {}

        if (trx.MultisigChild === true) {
          const multisig = await models.Transactions.find()
            .where({ 'MultiSignature.SignatureInfo.TransactionHash': trx.TransactionHash })
            .select()
            .sort({ Height: 'desc' })
            .lean()
            .exec()

          const multisigMapped =
            multisig &&
            multisig.length > 0 &&
            (await Promise.all(
              multisig.map(i => {
                return {
                  ...i,
                  ...(i.MultiSignature && {
                    MultiSignature: {
                      ...i.MultiSignature,
                      SignatureInfo: {
                        ...(i.MultiSignature.SignatureInfo && {
                          ...i.MultiSignature.SignatureInfo,
                          ...(i.MultiSignature.SignatureInfo.Signatures && {
                            Signatures: Object.entries(i.MultiSignature.SignatureInfo.Signatures).map(
                              ([key, value]) => {
                                return {
                                  Address: key,
                                  Signature: value,
                                }
                              }
                            ),
                          }),
                        }),
                      },
                    },
                  }),
                }
              })
            ))

          return {
            ...trx,
            MultiSignatureTransactions: multisigMapped,
            ...(multisigMapped.length > 0 && {
              MultiSignature: multisigMapped[0].MultiSignature,
            }),
          }
        }

        if (trx.Escrow != null) {
          const escrow = await models.Transactions.findOne()
            .where({ 'ApprovalEscrow.TransactionID': trx.TransactionID })
            .select()
            .lean()
            .exec()

          return {
            ...trx,
            EscrowTransaction: escrow && { ...escrow },
          }
        }

        return {
          ...trx,
          Status:
            (trx.TransactionType === 1 && trx.MultisigChild === false) ||
            (trx.TransactionType === 1 && trx.Escrow === null)
              ? 'Approved'
              : trx.Status,
          ...(trx.MultiSignature && {
            MultiSignature: {
              ...trx.MultiSignature,
              SignatureInfo: {
                ...(trx.MultiSignature.SignatureInfo && {
                  ...trx.MultiSignature.SignatureInfo,
                  ...(trx.MultiSignature.SignatureInfo.Signatures && {
                    Signatures: Object.entries(trx.MultiSignature.SignatureInfo.Signatures).map(([key, value]) => {
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
    transactions: (parent, { transactions }) => {
      if (transactions != null && transactions.length > 0) {
        pubsub.publish(events.transactions, {
          transactions,
        })
        return 'succesfully publish transactions data'
      }
      return 'failed publish transactions data'
    },
  },

  Subscription: {
    transactions: {
      subscribe: () => pubsub.asyncIterator([events.transactions]),
    },
  },
}
