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
const BaseService = require('./BaseService')
const { User } = require('../../models')
const config = require('../../config/config')
const { encrypt } = require('../../utils')

const mongoose = require('mongoose')
const db = mongoose.connection

module.exports = class UsersService extends BaseService {
  constructor() {
    super(User)
  }

  async createToken(user) {
    const { email, password } = user
    const result = {
      email: email,
      token: password,
      tokenExpired: moment().add(config.app.tokenExpired, 'hours').toDate(),
    }

    return result
  }

  async getMe(email, token) {
    if (email && token) {
      try {
        const user = await User.findByEmail(email)
        if (!user) {
          return { success: false, message: 'No user found with this login credentials.', data: null }
        }

        const isValidToken = token.trim() === user.token.trim()

        if (!isValidToken) {
          return { success: false, message: 'Invalid Token.', data: null }
        }

        const isExpired = moment().isAfter(user.tokenExpired)

        if (isExpired) {
          return { success: false, message: 'Your session expired. Sign in again.', data: null }
        }

        return { success: true, message: 'successfully get user.', data: user }
      } catch (err) {
        throw new console.error(err)
      }
    }
  }

  async generateSuperadmin(callback) {
    const password = await encrypt('P@ssw0rd')
    const payload = { email: 'superadmin@zoobc.net', password, role: 'Superadmin', status: 'Active' }

    let user = await User.findByEmail(payload.email)

    if (!user) {
      user = await User.create(payload)

      const tokenData = await this.createToken(user)

      const { token, tokenExpired } = tokenData

      await User.findByIdAndUpdate(user.id, { token, tokenExpired }, { new: true })

      return callback(null, tokenData)
    }
    return callback(null, null)
  }

  async signIn(email, password) {
    const user = await User.findByEmail(email)

    if (!user) {
      return { success: false, message: 'No user found with this login credentials.', data: null }
    }

    const isValid = await user.validatePassword(password)

    if (!isValid) {
      return { success: false, message: 'Invalid password.', data: null }
    }

    const tokenData = await this.createToken(user)

    const { token, tokenExpired } = tokenData

    await User.findByIdAndUpdate(user.id, { token, tokenExpired }, { new: true })

    return { success: true, message: 'succesfully login.', data: tokenData }
  }

  async resetDB(email, token) {
    const result = await this.getMe(email, token)

    const { success, message, data } = result

    const isAuthenticated = success && data ? true : false
    const isSuperAdmin = isAuthenticated && data.role === 'Superadmin' ? true : false

    if (isAuthenticated && isSuperAdmin) {
      try {
        const res = await db.dropDatabase()
        if (res) {
          db.close()
          return { success: true, message: 'DB succesfully dropped.', data: null }
        } else {
          return { success: false, message: 'DB failed to drop.', data: null }
        }
      } catch (error) {
        return { success: false, message: 'error when drop DB.', data: null }
      }
    }

    return {
      success,
      message: `You do not have authorization to reset this ${db.databaseName} database!. It caused by ${message}`,
      data,
    }
  }
}
