const swaggerJSDoc = require('swagger-jsdoc');
const nconf = require('nconf');
const config = require('./config');

const { description, version, license, author } = require('../package.json');
const host = nconf.get('app_host') || config.app.host;
const port = nconf.get('app_port') || config.app.port;
const apiDoc = `https://${host}:${port}${config.app.mainRoute}`;

const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'ZooBC Explorer API',
      version,
      description,
      contact: {
        email: author,
      },
      license: {
        name: license,
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    host: apiDoc,
    basePath: '/',
    produces: ['application/json'],
    schemes: ['https'],
    servers: [{ url: apiDoc }],
  },
  apis: ['./docs/api/*.js'],
};

module.exports = {
  config() {
    return swaggerJSDoc(options);
  },
};
