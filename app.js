require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const config = require('./config/config');
const port = config.app.port;
const app = express().set('port', port);

const server =
  config.app.modeServer === 'http'
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync(config.app.openSslKeyPath),
          cert: fs.readFileSync(config.app.openSslCertPath),
        },
        app
      );

require('./server/cors')(app);
require('./server/compression')(app);
require('./server/log')(app);
require('./server/routes')(app);
require('./server/swagger')(app);
require('./server/graphql')(app, server);
require('./server/cluster')(server);
require('./server/redis')();
require('./server/mongoose')();
require('./scheduler').start();

module.exports = app;
