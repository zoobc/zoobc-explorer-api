const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');

const models = require('../models');
const resolvers = require('../graphql/resolvers');
const typeDefs = require('../graphql/schema');
const loaders = require('../graphql/loaders');

const { msg } = require('../utils');
const config = require('../config/config');

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

module.exports = (app, server) => {
  const apolloServer = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.TOKEN_SECRET,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    },
  });

  apolloServer.applyMiddleware({ app, path: `${config.app.mainRoute}/graphql` });
  msg.green('🚀', `${config.app.modeServer}://${config.app.host}:${config.app.port}${apolloServer.graphqlPath}`);
  apolloServer.installSubscriptionHandlers(server);
  msg.green('🚀', `ws://${config.app.host}:${config.app.port}${apolloServer.subscriptionsPath}`);
};
