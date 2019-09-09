const config = require('./config');
const typeDefs = require('../graphql/schema/schemagraphql.js');
const resolvers = require('../graphql/resolvers');

const configGraphql = {
  path: config.app.mainRoute + '/graphql',
  typeDefs,
  resolvers,
};

module.exports = configGraphql;
