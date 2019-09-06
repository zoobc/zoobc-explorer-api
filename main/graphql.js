const chalk = require('chalk');
const { ApolloServer } = require('apollo-server-express');

const config = require('../config/config');
const configGraphql = require('../config/graphql');

module.exports = (app, server) => {
  const apolloServer = new ApolloServer({ typeDefs: configGraphql.typeDefs, resolvers: configGraphql.resolvers });
  apolloServer.applyMiddleware({ app, path: configGraphql.path });
  apolloServer.installSubscriptionHandlers(server);

  const host = `${config.app.modeServer}://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`;
  const ws = `ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`;
  console.log(`%s Start Graphql Server at ${host}`, chalk.green('🚀'));
  console.log(`%s Start Subscriptions at ${ws}`, chalk.green('🚀'));
};
