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
const jwt = require('jsonwebtoken')
const { ApolloServer, AuthenticationError } = require('apollo-server')

const models = require('../models')
const config = require('../config/config')
const typeDefs = require('../graphql/schema')
const { msg, hmacEncrypt } = require('../utils')
const resolvers = require('../graphql/resolvers')

const parseToken = token => {
  if (token.includes('Bearer ')) {
    return token.slice('Bearer '.length)
  }

  throw new Error('Invalid token format')
}

const verifyJwt = token => {
  const options = { ...config.token, expiresIn: `${config.app.tokenExpired}h` }

  return jwt.verify(parseToken(token), config.app.tokenSecret, options, (err, decoded) => {
    if (err) return err.message
    return decoded
  })
}

module.exports = () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    playground: true,
    introspection: true,
    context: async ({ req, connection }) => {
      if (connection) return connection.context

      if (req) {
        /** verify token if available */
        let auth = null
        const token = req.headers && req.headers.authorization
        if (token) {
          const verify = verifyJwt(token)

          if (verify === 'invalid signature') throw new AuthenticationError('Invalid token signature')
          if (verify === 'jwt expired') throw new AuthenticationError('Session login has been expired')

          if (verify && verify.payload) {
            const admin = await models.Admins.findOne({ _id: verify.payload._id, Role: verify.payload.Role }).exec()
            if (admin) auth = admin
          }
        }

        /** adding security header */
        if (config.graphql_client.useSignatureHeader === 'true') {
          const timestamp = parseInt(req.headers['x-timestamp']) - moment.utc('1970-01-01 00:00:00').unix()
          const signature = hmacEncrypt(`${config.graphql_client.id}&${timestamp}`, config.graphql_client.secret)

          const signatureClient = req.headers['x-signature']

          if (signatureClient !== signature)
            throw new AuthenticationError('You do not have authentication to access this endpoint')
        }

        return { req, models, auth }
      }
    },

    subscriptions: {
      path: `${config.app.mainRoute}/subscriptions`,
      onConnect: () => msg.green('🚀', 'Connected to websocket'),
      onDisconnect: () => msg.green('🚀', 'Disconnected from websocket'),
    },
  })

  // apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql` })
  // apolloServer.installSubscriptionHandlers(server)

  // server.listen(config.app.port, () => {
  //   msg.green('🚀', `Start ZooBC Graphql at ${apolloServer.graphqlPath} Handled by Process ${process.pid}`)
  // })

  apolloServer.listen(config.app.port).then(({ url, subscriptionsUrl }) => {
    const graphqlUrl = `${url.slice(0, -1)}${config.app.mainRoute}/graphql`
    msg.green('🚀', `Graphql at ${graphqlUrl}`)
    msg.green('🚀', `Subscriptions at ${subscriptionsUrl}`)
  })
}
