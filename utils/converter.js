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

const moment = require('moment')

const isValidByteArray = array => {
  if (array && array.byteLength !== undefined) return true
  return false
}

// for argument type of array
const formatDataGRPC = Payload => {
  Payload.map(function (item) {
    Object.entries(item).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formatDataGRPC(item[key])
      }
      if (isValidByteArray(value)) {
        if (key === 'Type' || key === 'Subtype' || key === 'Version') {
          item[key] = value[0]
        } else {
          item[key] = Buffer.from(value).toString('base64')
        }
      }
      if (key === 'Timestamp') {
        item[key] = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss')
      }
    })

    // Transaction Type Conversion Value
    if (item.TransactionType === 0) {
      item.TransactionType = 'Empty'
    } else if (item.TransactionType === 1) {
      item.TransactionType = 'Ordinary Payment'
    } else if (item.TransactionType === 3) {
      item.TransactionType = 'Node Registration'
    }

    return item
  })
}

// for argument type of object
const formatDataGRPC2 = Payload => {
  Object.entries(Payload).forEach(([key, value]) => {
    if (isValidByteArray(value)) {
      Payload[key] = Buffer.from(value).toString('base64')
    }
    if (key === 'Timestamp') {
      Payload[key] = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss')
    }

    // Transaction Type Conversion Value
    if (key === 'TransactionType') {
      if (Payload[key] === 0) {
        Payload[key] = 'Empty'
      } else if (Payload[key] === 1) {
        Payload[key] = 'Ordinary Payment'
      } else if (Payload[key] === 3) {
        Payload[key] = 'Node Registration'
      }
    }
  })
}

const formatCache = (name, payload) => {
  const valPayload = typeof payload === 'string' ? payload : Object.values(payload).join(',')
  return `${process.env.PORT}-${name}-${process.env.PROTO_PORT}:${valPayload}`
}

const concats = (sender, recipient) => {
  return sender.concat(recipient.filter(item => sender.indexOf(item) < 0))
}

const zoobitConversion = curr => {
  if (!curr || curr === 0) return 0
  const result = curr / Math.pow(10, 8)

  if (result.toString().indexOf('e') > 0) {
    const e = parseInt(result.toString().slice(-1))
    return parseFloat(result).toFixed(e)
  }

  return parseFloat(result)
}

const bufferStr = buff => {
  const result = Buffer.from(buff).toString('base64')
  if (result === 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=') return null
  return result
}

module.exports = {
  formatDataGRPC,
  formatDataGRPC2,
  formatCache,
  concats,
  zoobitConversion,
  bufferStr,
}
