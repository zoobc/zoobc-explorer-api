require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');

const config = require('../config/config');
const port = config.app.port;
const app = express().set('port', port);

// serve static files in express
app.use(express.static(path.join(__dirname, '../zoobc-explorer-ui/build')));

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
    try {
      if (fs.existsSync(config.app.pidPath)) {
        const serverPid = fs.readFileSync(config.app.pidPath, { encoding: 'utf8' });
        fs.unlinkSync(config.app.pidPath);
        require('../utils/kill-pid')(serverPid);
      }
    } catch (error) {
      throw error;
    }
  },

  port: () => {
    console.info(port);
  },
};
