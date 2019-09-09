const os = require('os');
const chalk = require('chalk');
const cluster = require('cluster');

const config = require('../config/config');

module.exports = (server, modeCluster) => {
  const port = config.app.port;

  if (cluster.isMaster && modeCluster) {
    const cpus = os.cpus().length;

    console.log(`%s Mode Cluster. Forking for ${cpus} CPUs`, chalk.green('🚀'));
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
  } else {
    server.listen(port, () => {
      console.log(`%s Start Express Server on Port ${port} Handled by Process ${process.pid}`, chalk.green('🚀'));
    });

    process.on('SIGINT', () => {
      server.close(err => {
        if (err) {
          console.log(`%s Error Express Server : ${err}`, chalk.red('🚀'));
          process.exit(1);
        } else {
          console.log(`%s Close Express Server on Port ${port} Handled by Process ${process.pid}`, chalk.red('🚀'));
          process.exit(0);
        }
      });
    });
  }
};
