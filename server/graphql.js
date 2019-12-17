const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');

const models = require('../models');
const resolvers = require('../graphql/resolvers');
const typeDefs = require('../graphql/schema');
const loaders = require('../graphql/loaders');

const { msg } = require('../utils');
const config = require('../config/config');

const parseToken = token => {
  if (token.includes('Bearer ')) {
    return token.slice('Bearer '.length);
  }
  throw new AuthenticationError('Invalid token format');
};

const getMe = async req => {
  const { authorization } = req.headers;

  if (authorization && authorization !== undefined && authorization !== 'Bearer ' + undefined && authorization !== '') {
    const token = parseToken(authorization);

    if (token && token !== undefined) {
      const options = {
        expiresIn: `${config.app.tokenExpired}h`,
        audience: config.token.audience,
        issuer: config.token.issuer,
        subject: config.token.subject,
      };

      try {
        const verifiedToken = await jwt.verify(token, config.app.tokenSecret, options);
        return Array.isArray(verifiedToken) ? verifiedToken[0] : verifiedToken;
      } catch (err) {
        if (err && err.name === 'TokenExpiredError') {
          throw new AuthenticationError('Session has been expired.');
        }
        if (err && err.name === 'JsonWebTokenError') {
          throw new AuthenticationError('Invalid format token.');
        }
      }
    }

    return null;
  }

  return null;
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
        secret: config.app.tokenSecret,
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
