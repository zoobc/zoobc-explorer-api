// const { ApolloServer } = require('apollo-server-express')
const { ApolloServer } = require('apollo-server')

const models = require('../models')
const resolvers = require('../graphql/resolvers')
const typeDefs = require('../graphql/schema')

const { msg } = require('../utils')
const config = require('../config/config')

module.exports = (app, server) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    context: { models },
    subscriptions: {
      path: `${config.app.mainRoute}/graphql`,
      onConnect: () => console.log('Connected to websocket'),
    },
  })

  apolloServer.listen(config.app.port).then(({ url, subscriptionsUrl }) => {
    console.log('==url', url)
    console.log('==subscriptionsUrl', subscriptionsUrl)
  })

  // const apolloServer = new ApolloServer({
  //   introspection: true,
  //   typeDefs,
  //   resolvers,
  //   context: { models },
  //   subscriptions: {
  //     path: `${config.app.mainRoute}/graphql`,
  //     onConnect: () => console.log('Connected to websocket'),
  //     onDisconnect: () => console.log('Disconnected from websocket'),
  //   },
  // })
  // apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql` })
  // msg.green('🚀', `http://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`)
  // apolloServer.installSubscriptionHandlers(server)
  // msg.green('🚀', `ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`)
}
