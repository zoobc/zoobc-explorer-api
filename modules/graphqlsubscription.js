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
    introspection: true,
    context: { models },
    subscriptions: {
      path: `${config.app.mainRoute}/graphql`,
      onConnect: () => msg.green('🚀', 'Connected to websocket'),
      onDisconnect: () => msg.green('🚀', 'Disconnected from websocket'),
    },
  })

  apolloServer.listen(config.app.port).then(({ url, subscriptionsUrl }) => {
    const graphqlUrl = `${url.slice(0, -1)}${config.app.mainRoute}/graphql`
    msg.green('🚀', `Graphql at ${graphqlUrl}`)
    msg.green('🚀', `Subscriptions at ${subscriptionsUrl}`)
  })
}
