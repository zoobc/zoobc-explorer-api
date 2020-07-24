const { ApolloServer } = require('apollo-server')

const models = require('../models')
const resolvers = require('../graphql/resolvers')
const typeDefs = require('../graphql/schema')

const { msg } = require('../utils')
const config = require('../config/config')

module.exports = () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    playground: true,
    introspection: true,
    context: { models },
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
