const { ApolloServer, AuthenticationError } = require('apollo-server')
const moment = require('moment')

const models = require('../models')
const resolvers = require('../graphql/resolvers')
const typeDefs = require('../graphql/schema')
const { msg, hmacEncrypt } = require('../utils')
const config = require('../config/config')

module.exports = () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    playground: true,
    introspection: true,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context
      }

      if (req) {
        /** adding security header */
        const timestamp = moment.utc().unix() - moment.utc('1970-01-01 00:00:00').unix()
        const signature = hmacEncrypt(`${config.graphql_client.id}&${timestamp}`, config.graphql_client.secret)

        const signatureClient = req.headers['X-signature']

        if (signatureClient !== signature)
          throw new AuthenticationError('You do not have authentication to access this endpoint')

        return {
          models,
        }
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
