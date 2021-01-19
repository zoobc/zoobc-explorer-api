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

const HandleError = require('./HandleError')
const BaseController = require('./BaseController')
const { TransactionsService } = require('../services')
const { ResponseBuilder, Converter, RedisCache } = require('../../utils')

const cache = {
  transactions: 'transactions',
  amount: 'transaction:amount',
  type: 'transaction:type',
}

module.exports = class TransactionController extends BaseController {
  constructor() {
    super(new TransactionsService())
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder()
    const handleError = new HandleError()
    const { page, limit, fields, order, where } = req.query
    try {
      const cacheTransactions = Converter.formatCache(cache.transactions, req.query)

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
              .setPaginate(resRedis.paginate)
              .setMessage('Transactions fetched successfully')
              .build()
          )
          return
        }

        this.service.paginate({ page, limit, fields, where, order }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err)
            return
          }

          RedisCache.set(cacheTransactions, result, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis)
              return
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setPaginate(result.paginate)
                .setMessage('Transactions fetched successfully')
                .build()
            )
          })
        })
      })
    } catch (error) {
      handleError.sendCatchError(res, error)
    }
  }

  async getOne(req, res) {
    const responseBuilder = new ResponseBuilder()
    const handleError = new HandleError()
    const id = req.params.id
    try {
      if (!id) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setData({}).setMessage('Invalid Payload Parameter').build()
        )
        return
      }
      const cacheTransaction = Converter.formatCache(cache.transaction, id)
      RedisCache.get(cacheTransaction, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis)
          return
        }
        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder.setData(resRedis).setMessage('Transaction fetched successfully').build()
          )
        }
        this.service.findOne({ TransactionID: id }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err)
            return
          }
          if (!result) {
            this.sendNotFoundResponse(res, responseBuilder.setData({}).setMessage('Transaction not found').build())
            return
          }
          RedisCache.set(cacheTransaction, result, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis)
              return
            }
            this.sendSuccessResponse(
              res,
              responseBuilder.setData(result).setMessage('Transaction fetched successfully').build()
            )
          })
        })
      })
    } catch (error) {
      handleError.sendCatchError(res, error)
    }
  }
}
