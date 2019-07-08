const swaggerUi = require('swagger-ui-express');
const path = require('path');
const config = require('../config/config');
const { apiLimiter } = require('../main/apiLimiter');
const swaggerConfig = require('../config/swagger').config();

const swaggerOptions = {
  customSiteTitle: 'ZooBC Explorer API',
  customCss: '.topbar { display: none }',
};

module.exports = function(app) {
  /** static api doc with execute */
  app.use(config.app.mainRoute, apiLimiter);
  app.use(
    config.app.mainRoute + '/demo',
    swaggerUi.serve,
    swaggerUi.setup(swaggerConfig, swaggerOptions)
  );

  /** static api doc */
  app.get(
    config.app.mainRoute,
    (req, res) => {
      res.sendFile(path.join(__dirname, '../apidoc/apidoc.html'));
    },
    swaggerUi.setup(swaggerConfig, swaggerOptions)
  );
  app.get(config.app.mainRoute + '/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerConfig);
  });
};
