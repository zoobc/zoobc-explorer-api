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
  apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql` })
  apolloServer.installSubscriptionHandlers(server)

  server.listen(config.app.port, () => {
    msg.green('🚀', `Graphql at http://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`)
    msg.green('🚀', `Subscriptions at ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`)
  })
}
