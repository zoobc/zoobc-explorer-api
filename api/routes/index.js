const config = require('../../config/config')
const { limiter } = require('../../modules/limiter')

module.exports = function (app) {
  app.use(config.app.mainRoute + '/blocks', limiter, require('./blocks'))
  app.use(config.app.mainRoute + '/blocks-graph', limiter, require('./blocksGraph'))
  app.use(config.app.mainRoute + '/transactions', limiter, require('./transactions'))
  app.use(config.app.mainRoute + '/transactions-graph', limiter, require('./transactionsGraph'))
  app.use(config.app.mainRoute + '/search', limiter, require('./search'))
  app.use(config.app.mainRoute + '/accounts', limiter, require('./accounts'))
  app.use(config.app.mainRoute + '/nodes', limiter, require('./nodes'))
}
