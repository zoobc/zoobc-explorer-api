const config = require('../config/config');
const { apiLimiter } = require('../main/apiLimiter');

module.exports = function(app) {
  app.use(config.app.mainRoute + '/blocks', apiLimiter, require('../restapi/routes/blocks'));
  app.use(config.app.mainRoute + '/blocks-graph', apiLimiter, require('../restapi/routes/blocksGraph'));
  app.use(config.app.mainRoute + '/transactions', apiLimiter, require('../restapi/routes/transactions'));
  app.use(config.app.mainRoute + '/transactions-graph', apiLimiter, require('../restapi/routes/transactionsGraph'));
};
