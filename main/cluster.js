const cluster = require('cluster');
const os = require('os');
const chalk = require('chalk');

module.exports = (server, port, modeCluster) => {
  if (cluster.isMaster && modeCluster) {
    const cpus = os.cpus().length;

    console.log(`%s Mode Cluster. Forking for ${cpus} CPUs`, chalk.green('🚀'));
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
  } else {
    server.listen(port, () => {
      console.log(
        `%s Express server on port ${server.address().port} handled by process ${process.pid}`,
        chalk.green('🚀')
      );
    });

    /** close server */
    process.on('SIGINT', () => {
      console.info('%s SIGINT signal received', chalk.red('🚀'));

      /** Stops the server from accepting new connections and finishes existing connections. */
      server.close(function(err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
    });
  }
};
