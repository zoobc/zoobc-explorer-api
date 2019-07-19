const config = require('../config/config');
const { apiLimiter } = require('../main/apiLimiter');

module.exports = function(app) {
  app.use(config.app.mainRoute + '/blocks', apiLimiter);
  app.use(config.app.mainRoute + '/blocks', require('../restapi/routes/blocks'));
  app.use(config.app.mainRoute + '/transactions', apiLimiter);
  app.use(config.app.mainRoute + '/transactions', require('../restapi/routes/transactions'));
  app.use(config.app.mainRoute + '/transactions-graph', apiLimiter);
<<<<<<< HEAD
  app.use(config.app.mainRoute + '/transactions-graph', require('../restapi/routes/transactionsGraph'));
  app.use(config.app.mainRoute + '/account-balances', apiLimiter);
  app.use(config.app.mainRoute + '/account-balances', require('../restapi/routes/accountBalances'));
  app.use(config.app.mainRoute + '/peers', apiLimiter);
  app.use(config.app.mainRoute + '/peers', require('../restapi/routes/peers'));
=======
  app.use(
    config.app.mainRoute + '/transactions-graph',
    require('../restapi/routes/transactionsGraph')
  );
>>>>>>> 696e51c5ff803d69e30b88d64a9eebbf55dfdf89
};
