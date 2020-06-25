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

module.exports = {
  Query: {
    transactions: (parent, args, { models }) => {
      const { page, limit, order, BlockID, AccountAddress } = args
      const pg = page !== undefined ? parseInt(page) : 1
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' }
      const blockId = BlockID !== undefined ? { BlockID } : null
      const accountAddress =
        AccountAddress !== undefined ? { $or: [{ Sender: AccountAddress }, { Recipient: AccountAddress }] } : null

      const criteria = {
        $and: [blockId ? blockId : accountAddress ? accountAddress : {}, { TransactionType: { $ne: 5 } }],
      }

      return new Promise((resolve, reject) => {
        const cacheTransactions = Converter.formatCache(cache.transactions, args)
        RedisCache.get(cacheTransactions, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Transactions.where({ TransactionType: { $ne: 5 } }).countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err)

            models.Transactions.where(criteria).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err)

              models.Transactions.find()
                .where(criteria)
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err)

                  let dataMapped = []

                  data &&
                    data.length > 0 &&
                    data.map(trx => {
                      if (trx.MultisigChild == true) {
                        models.Transactions.find()
                          .where({
                            'MultiSignature.SignatureInfo.TransactionHash': trx.TransactionHash,
                          })
                          .select()
                          .sort({ Height: 'desc' })
                          .lean()
                          .exec((err, multisig) => {
                            if (err) return reject(err)

                            const multisigMapped = multisig.map(i => {
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

                            dataMapped.push({
                              ...trx,
                              MultiSignatureTransactions: multisigMapped,
                              ...(multisigMapped.length > 0 && {
                                MultiSignature: multisigMapped[0].MultiSignature,
                              }),
                            })
                          })
                      } else {
                        dataMapped.push({
                          ...trx,
                          MultiSignatureTransactions: [],
                          ...(trx.MultiSignature && {
                            MultiSignature: {
                              ...trx.MultiSignature,
                              SignatureInfo: {
                                ...(trx.MultiSignature.SignatureInfo && {
                                  ...trx.MultiSignature.SignatureInfo,
                                  ...(trx.MultiSignature.SignatureInfo.Signatures && {
                                    Signatures: Object.entries(trx.MultiSignature.SignatureInfo.Signatures).map(
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
                        })
                      }
                    })

                  const result = {
                    Transactions: dataMapped,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: blockId || accountAddress ? totalWithFilter : totalWithoutFilter,
                    },
                  }

                  RedisCache.set(cacheTransactions, result, err => {
                    if (err) return reject(err)
                    return resolve(result)
                  })
                })
            })
          })
        })
      })
    },

    transaction: (parent, args, { models }) => {
      const { TransactionID } = args

      const criteria = {
        $or: [
          { TransactionID: TransactionID },
          { 'MultiSignature.SignatureInfo.TransactionHash': Buffer.from(TransactionID, 'base64') },
        ],
      }

      return new Promise((resolve, reject) => {
        const cacheTransaction = Converter.formatCache(cache.transaction, args)
        RedisCache.get(cacheTransaction, (err, resRedis) => {
          if (err) return reject(err)
          if (resRedis) return resolve(resRedis)

          models.Transactions.findOne()
            .where(criteria)
            .lean()
            .exec((err, trx) => {
              if (err) return reject(err)
              if (!trx) return resolve({})

              if (trx.MultisigChild == true) {
                models.Transactions.find()
                  .where({
                    'MultiSignature.SignatureInfo.TransactionHash': trx.TransactionHash,
                  })
                  .select()
                  .sort({ Height: 'desc' })
                  .lean()
                  .exec((err, multisig) => {
                    if (err) return reject(err)

                    const multisigMapped = multisig.map(i => {
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

                    const result = {
                      ...trx,
                      MultiSignatureTransactions: multisigMapped,
                      ...(multisigMapped.length > 0 && {
                        MultiSignature: multisigMapped[0].MultiSignature,
                      }),
                    }

                    RedisCache.set(cacheTransaction, result, err => {
                      if (err) return reject(err)
                      return resolve(result)
                    })
                  })
              } else {
                const result = {
                  ...trx,
                  MultiSignatureTransactions: [],
                  ...(trx.MultiSignature && {
                    MultiSignature: {
                      ...trx.MultiSignature,
                      SignatureInfo: {
                        ...(trx.MultiSignature.SignatureInfo && {
                          ...trx.MultiSignature.SignatureInfo,
                          ...(trx.MultiSignature.SignatureInfo.Signatures && {
                            Signatures: Object.entries(trx.MultiSignature.SignatureInfo.Signatures).map(
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

                RedisCache.set(cacheTransaction, result, err => {
                  if (err) return reject(err)
                  return resolve(result)
                })
              }
            })
        })
      })
    },
  },

  Transaction: {
    Block: async (transaction, args, { models }) => {
      return await models.Blocks.findOne({ BlockID: transaction.BlockID }).lean()
    },
  },

  Subscription: {
    transactions: {
      subscribe: () => pubsub.asyncIterator([events.transactions]),
    },
  },
}
