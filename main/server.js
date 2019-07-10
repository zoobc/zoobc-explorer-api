require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const config = require('../config/config');
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

module.exports = {
  start: () => {
    require('./redis')();
    require('./cors')(app);
    require('./compression')(app);
    require('./log')(app);
    require('./swagger')(app);
    require('./cluster')(server, port, config.app.modeCluster);
  },

  stop: () => {
    require('../utils/kill-port')(port);
  },

  port: () => {
    console.info(port);
  },
};
