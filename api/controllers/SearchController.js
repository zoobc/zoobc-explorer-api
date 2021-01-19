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

const BaseController = require('./BaseController')
const HandleError = require('./HandleError')
const { ResponseBuilder, Converter, RedisCache } = require('../../utils')
const { BlocksService, TransactionsService } = require('../services')

const cacheBlock = {
  block: 'block',
}

const cacheTransaction = {
  transaction: 'transaction',
}

module.exports = class SearchController extends BaseController {
  constructor() {
    super()
    this.blockService = new BlocksService()
    this.transactionService = new TransactionsService()
  }

  async SearchIdHash(req, res) {
    const responseBuilder = new ResponseBuilder()
    const handleError = new HandleError()
    const { id } = req.query
    try {
      if (!id) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setData({}).setMessage('Invalid Payload Parameter').build()
        )
        return
      }
      if (id === 0) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setData({}).setMessage('Invalid data: unable to add value by zero.').build()
        )
        return
      }
      const cacheBlocks = Converter.formatCache(cacheBlock.block, id)
      RedisCache.get(cacheBlocks, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis)
          return
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis.data)
              .setPaginate(resRedis.setPaginate)
              .setMessage('Block fetched successfully')
              .build()
          )
          return
        }
        this.blockService.findOne({ BlockID: id }, (errBlock, resultBlock) => {
          if (errBlock) {
            handleError.sendCatchError(res, errBlock)
            return
          }

          if (resultBlock) {
            RedisCache.set(
              cacheBlocks,
              resultBlock,
              err => {
                if (err) {
                  handleError.sendCatchError(res, err)
                  return
                }
              },

              this.sendSuccessResponse(
                res,
                responseBuilder.setData(resultBlock).setMessage('Block fetched successfully').build()
              )
            )
            return
          } else {
            const cacheTransactions = Converter.formatCache(cacheTransaction.transaction, id)
            RedisCache.get(cacheTransactions, (errRedis, resRedis) => {
              if (errRedis) {
                handleError.sendCatchError(res, errRedis)
                return
              }

              if (resRedis) {
                this.sendSuccessResponse(
                  res,
                  responseBuilder
                    .setData(resRedis.data)
                    .setPaginate(resRedis.setPaginate)
                    .setMessage('Transaction fetched successfully')
                    .build()
                )
                return
              }
              this.transactionService.findOne({ TransactionID: id }, (errTrans, resultTrans) => {
                if (errTrans) {
                  handleError.sendCatchError(res, errTrans)
                  return
                }

                if (resultTrans !== null) {
                  RedisCache.set(
                    cacheTransactions,
                    resultTrans,
                    err => {
                      if (err) {
                        handleError.sendCatchError(res, err)
                        return
                      }
                    },

                    this.sendSuccessResponse(
                      res,
                      responseBuilder.setData(resultTrans).setMessage('Transaction fetched successfully').build()
                    )
                  )
                  return
                } else {
                  this.sendSuccessResponse(res, responseBuilder.setData({}).setMessage('No Data fetched').build())
                  return
                }
              })
            })
          }
        })
      })
    } catch (error) {
      handleError.sendCatchError(res, error)
    }
  }
}
