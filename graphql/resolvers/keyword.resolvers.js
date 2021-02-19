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

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' }
  }
  return { [string]: 'asc' }
}

function parseResponses(success, message, datas, paginate) {
  return {
    Success: success,
    Message: message,
    Data: datas ? datas : [],
    Paginate: {
      Page: paginate ? paginate.Page : 0,
      Count: paginate ? paginate.Count : 0,
      Total: paginate ? paginate.Total : 0,
    },
  }
}

function parseResponse(success, message, data) {
  return {
    Success: success,
    Message: message,
    Data: data ? data : {},
  }
}

module.exports = {
  Query: {
    keywords: async (parent, args, { models, auth }) => {
      try {
        if (!auth) return parseResponses(false, 'You must be logged to access this')
        if (auth && auth.Role !== 'Admin') return parseResponses(false, 'You do not have authorized this access')

        const { page, limit, order } = args
        const pg = page !== undefined ? parseInt(page) : 1
        const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit)
        const od = order !== undefined ? parseOrder(order) : { Keyword: 'asc' }

        const total = await models.Keywords.countDocuments().exec()
        const data = await models.Keywords.find()
          .populate('Admin')
          .select()
          .limit(lm)
          .skip((pg - 1) * lm)
          .sort(od)
          .lean()
          .exec()
        const paginate = { Page: parseInt(pg), Count: parseInt(data.length), Total: parseInt(total) }

        return parseResponses(true, 'Success fetch data', data ? data : [], paginate)
      } catch (err) {
        return parseResponses(false, err.message)
      }
    },

    keyword: async (parent, args, { models }) => {
      try {
        const { Keyword } = args

        const data = await models.Keywords.findOne({ Keyword: { $regex: Keyword.toLowerCase(), $options: 'i' } })
          .populate('Admin')
          .lean()
          .exec()

        if (!data) return parseResponse(false, 'Data not found')

        return parseResponse(true, 'Success fetch data', data ? data : {})
      } catch (err) {
        return parseResponses(false, err.message)
      }
    },
  },

  Mutation: {
    create: async (parent, args, { models, auth }) => {
      try {
        const { Keyword, Content, ExpiredAt } = args

        if (!auth) return parseResponse(false, 'You must be logged to access this')
        if (auth && auth.Role !== 'Admin') return parseResponse(false, 'You do not have authorized this access')
        if (!Keyword || !Content) return parseResponse(false, 'Invalid payload data')

        const data = await models.Keywords.findOne({ Keyword: { $regex: Keyword, $options: 'i' } })
          .lean()
          .exec()

        if (data) return parseResponse(false, 'Keyword already exists')

        const payload = { Keyword, Content, ExpiredAt, Seen: 0, CreatedBy: auth._id, CreatedAt: moment().toDate() }
        const result = await models.Keywords.create(payload)
        return parseResponse(true, 'Success created data', result)
      } catch (err) {
        return parseResponse(false, err.message)
      }
    },

    update: async (parent, args, { models, auth }) => {
      try {
        const { Keyword, Content, ExpiredAt } = args

        if (!auth) return parseResponse(false, 'You must be logged to access this')
        if (auth && auth.Role !== 'Admin') return parseResponse(false, 'You do not have authorized this access')
        if (!Keyword || !Content) return parseResponse(false, 'Invalid payload data')

        const data = await models.Keywords.findOne({ Keyword: { $regex: Keyword.toLowerCase(), $options: 'i' } })
          .lean()
          .exec()

        if (!data) return parseResponse(false, 'Data not found')

        const payload = { Content, ExpiredAt }
        const result = await models.Keywords.findByIdAndUpdate({ _id: data._id }, payload)
        return parseResponse(true, 'Success updated data', result)
      } catch (err) {
        return parseResponse(false, err.message)
      }
    },

    destroy: async (parent, args, { models, auth }) => {
      try {
        const { Keyword } = args

        if (!auth) return parseResponse(false, 'You must be logged to access this')
        if (auth && auth.Role !== 'Admin') return parseResponse(false, 'You do not have authorized this access')
        if (!Keyword) return parseResponse(false, 'Invalid payload data')

        const data = await models.Keywords.findOne({ Keyword: { $regex: Keyword.toLowerCase(), $options: 'i' } })
          .lean()
          .exec()

        if (!data) return parseResponse(false, 'Data not found')

        const result = await models.Keywords.deleteOne({ _id: data._id })
        return parseResponse(true, 'Success deleted data', result)
      } catch (err) {
        return parseResponse(false, err.message)
      }
    },
  },
}
