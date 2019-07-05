const fs = require('fs');
const http = require('http');
const https = require('https');
const chalk = require('chalk');

const cluster = require('./cluster');
const config = require('../config/config');

module.exports = app => {
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
  const port = config.app.port;
  app.set('port', port);

  /** create server */
  const modeCluster = config.app.modeCluster;
  cluster(server, port, modeCluster);

  /** timeout to kill */
  process.on('message', msg => {
    if (msg == 'shutdown') {
      console.log('%s Closing all connections...', chalk.red('🚀'));

      setTimeout(() => {
        console.log('%s Finished closing connections', chalk.red('🚀'));
        process.exit(0);
      }, 1500);
    }
  });
};
