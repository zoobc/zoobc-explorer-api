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
const { NodesService } = require('../services')
const { ResponseBuilder, Converter, RedisCache } = require('../../utils')

const cache = {
  nodes: 'nodes',
  node: 'node',
}

module.exports = class NodeController extends BaseController {
  constructor() {
    super(new NodesService())
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder()
    const handleError = new HandleError()
    const { page, limit, fields, where, order } = req.query

    try {
      const cacheNodes = Converter.formatCache(cache.nodes, req.query)
      RedisCache.get(cacheNodes, (errRedis, resRedis) => {
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
              .setMessage('Nodes fetched successfully')
              .build()
          )
          return
        }

        this.service.paginate({ page, limit, fields, where, order }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err)
            return
          }

          RedisCache.set(cacheNodes, result.data, err => {
            if (err) {
              handleError.sendCatchError(res, err)
              return
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setPaginate(result.paginate)
                .setMessage('Nodes fetched successfully')
                .build()
            )
            return
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
    const nodeID = req.params.nodeID

    try {
      if (!nodeID) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setData({}).setMessage('Invalid Payload Parameter').build()
        )
        return
      }

      const cacheNode = Converter.formatCache(cache.node, nodeID)
      RedisCache.get(cacheNode, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis)
          return
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder.setData(resRedis).setMessage('Node fetched successfully').build()
          )
          return
        }

        this.service.findOne({ NodeID: nodeID }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err)
            return
          }

          if (!result) {
            this.sendNotFoundResponse(res, responseBuilder.setData({}).setMessage('Node not found').build())
            return
          }

          RedisCache.set(cacheNode, result, err => {
            if (err) {
              handleError.sendCatchError(res, err)
              return
            }

            this.sendSuccessResponse(
              res,
              responseBuilder.setData(result).setMessage('Node fetched successfully').build()
            )
            return
          })
        })
      })
    } catch (error) {
      handleError.sendCatchError(res, error)
    }
  }
}
