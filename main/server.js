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
    require('./graphql')(app);
    require('./swagger')(app);
    require('./cluster')(server, port, config.app.modeCluster);
  },

  start: () => {
    require('./cors')(app);
    require('./compression')(app);
    require('./log')(app);
    require('./routes')(app);
    require('./graphql')(app);
    require('./swagger')(app);
    require('./cluster')(server, port, false);
  },

  stop: () => {
    require('../utils/kill-port')(port);
  },

  port: () => {
    console.info(port);
  },
};
