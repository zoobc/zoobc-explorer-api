const { ApolloServer } = require('apollo-server-express')

const models = require('../models')
const resolvers = require('../graphql/resolvers')
const typeDefs = require('../graphql/schema')

const { msg } = require('../utils')
const config = require('../config/config')

module.exports = (app, server) => {
  const apolloServer = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    context: { models },
  })

  apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql` })
  msg.green('🚀', `http://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`)
  apolloServer.installSubscriptionHandlers(server)
  msg.green('🚀', `ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`)
}
