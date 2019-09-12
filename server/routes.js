const config = require('../config/config');
const { apiLimiter } = require('./apiLimiter');

module.exports = function(app) {
  app.use(config.app.mainRoute + '/blocks', apiLimiter, require('../api/routes/blocks'));
  app.use(config.app.mainRoute + '/blocks-graph', apiLimiter, require('../api/routes/blocksGraph'));
  app.use(config.app.mainRoute + '/transactions', apiLimiter, require('../api/routes/transactions'));
  app.use(config.app.mainRoute + '/transactions-graph', apiLimiter, require('../api/routes/transactionsGraph'));
  app.use(config.app.mainRoute + '/search', apiLimiter, require('../api/routes/search'));
};
