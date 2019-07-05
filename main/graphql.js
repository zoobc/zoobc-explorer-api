const configGraphql = require('../config/graphql');

module.exports = (app) => {
  configGraphql.connectToServer(app);
};
