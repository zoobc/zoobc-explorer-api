require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');

const config = require('../config/config');
const port = config.app.port;
const app = express().set('port', port);

const pathBuildUI = '../zoobc-explorer-ui/build';

fs.stat(path.join(__dirname, pathBuildUI), err => {
  if (!err) {
    app.use(express.static(path.join(__dirname, pathBuildUI)));
  }
});

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
  init: () => {
    require('./redis')();
    require('./cors')(app);
    require('./compression')(app);
    require('./log')(app);
    require('./routes')(app);
    require('./swagger')(app);
    require('./graphql')(app, server);
    require('./cluster')(server, config.app.modeCluster);
  },

  start: () => {
    require('./cors')(app);
    require('./compression')(app);
    require('./log')(app);
    require('./routes')(app);
    require('./swagger')(app);
    require('./graphql')(app, server);
    require('./cluster')(server, false);
  },

  stop: () => {
    require('../utils/kill-port')(port);
  },

  port: () => {
    console.info(port);
  },
};
