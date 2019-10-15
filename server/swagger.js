const path = require('path');
const swaggerUi = require('swagger-ui-express');

const config = require('../config/config');
const { apiLimiter } = require('./apiLimiter');
const swaggerConfig = require('../config/swagger').config();

const swaggerOptions = {
  customSiteTitle: 'ZooBC Explorer API',
  customCss: '.topbar { display: none }',
};

module.exports = function(app) {
  /** static api doc with execute */
  app.use(config.app.mainRoute, apiLimiter);
  app.use(config.app.mainRoute + '/doc', swaggerUi.serve, swaggerUi.setup(swaggerConfig, swaggerOptions));

  /** static api doc */
  app.get(
    config.app.mainRoute,
    (req, res) => {
      res.sendFile(path.join(__dirname, '../html/apidoc.html'));
    },
    swaggerUi.setup(swaggerConfig, swaggerOptions)
  );
  app.get(config.app.mainRoute + '/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerConfig);
  });
};
