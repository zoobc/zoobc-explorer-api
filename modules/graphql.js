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

const { ApolloServer } = require('apollo-server-express')

const models = require('../models')
const typeDefs = require('../graphql/schema')
const resolvers = require('../graphql/resolvers')

const { msg } = require('../utils')
const config = require('../config/config')

module.exports = (app, server) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    playground: true,
    introspection: true,
    context: { models },
    subscriptions: {
      path: `${config.app.mainRoute}/graphql`,
      onConnect: () => msg.green('🚀', 'Connected to websocket'),
      onDisconnect: () => msg.green('🚀', 'Disconnected from websocket'),
    },
  })
  apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql`, cors: false })
  apolloServer.installSubscriptionHandlers(server)

  msg.green('🚀', `Graphql at http://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`)
  msg.green('🚀', `Subscriptions at ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`)
}
