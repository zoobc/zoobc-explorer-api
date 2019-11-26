const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => (me ? skip : new ForbiddenError('Not authenticated as user.'));

const isAdmin = combineResolvers(isAuthenticated, (parent, args, { me: { role } }) =>
  role === 'Admin' ? skip : new ForbiddenError('Not authorized as admin.')
);

const isSuperAdmin = combineResolvers(isAuthenticated, (parent, args, { me: { role } }) =>
  role === 'Superadmin' ? skip : new ForbiddenError('Not authorized as super admin.')
);

module.exports = {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
};
