const config = require('../config/config');
const { apiLimiter } = require('../main/apiLimiter');

module.exports = function(app) {
  app.use(config.app.mainRoute + '/blocks', apiLimiter);
  app.use(config.app.mainRoute + '/blocks', require('../restapi/routes/blocks'));
  app.use(config.app.mainRoute + '/transactions', apiLimiter);
  app.use(config.app.mainRoute + '/transactions', require('../restapi/routes/transactions'));
  app.use(config.app.mainRoute + '/transactions-graph', apiLimiter);
  app.use(
    config.app.mainRoute + '/transactions-graph',
    require('../restapi/routes/transactionsGraph')
  );
};
