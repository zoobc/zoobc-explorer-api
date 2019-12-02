const moment = require('moment');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, UserInputError } = require('apollo-server');
const { isAuthenticated, isSuperAdmin } = require('./authorization');
const config = require('../../config/config');

const createToken = async (user, secret) => {
  const { id, email, role, status } = user;

  const options = {
    expiresIn: `${config.app.tokenExpired}h`,
    audience: config.token.audience,
    issuer: config.token.issuer,
    subject: config.token.subject,
  };

  const token = await jwt.sign({ id, email, role, status }, secret, options);

  const result = {
    user,
    token_expired: moment()
      .add(config.app.tokenExpired, 'hours')
      .toDate(),
    token_access: token,
  };

  return result;
};

module.exports = {
  Query: {
    users: combineResolvers(isAuthenticated, async (parent, args, { models }) => {
      return await models.User.find();
    }),
    user: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    }),
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (parent, { email, password, role }, { models, secret }) => {
      const user = await models.User.create({
        email,
        password,
        role,
      });

      return createToken(user, secret);
    },

    signIn: async (parent, { email, password }, { models, secret }) => {
      const user = await models.User.findByEmail(email);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return createToken(user, secret);
    },

    updateUser: combineResolvers(isSuperAdmin, async (parent, { status }, { models, me }) => {
      return await models.User.findByIdAndUpdate(me.id, { status }, { new: true });
    }),

    deleteUser: combineResolvers(isSuperAdmin, async (parent, { id }, { models }) => {
      const user = await models.User.findById(id);

      if (user) {
        await user.remove();
        return true;
      } else {
        return false;
      }
    }),
  },
};
