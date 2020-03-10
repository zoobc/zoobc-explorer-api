const os = require('os');
const cluster = require('cluster');

const config = require('../config/config');
const { msg } = require('../utils');

module.exports = server => {
  if (cluster.isMaster) {
    const cpus = os.cpus().length;

    msg.green('🚀', `Mode Cluster. Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
  } else {
    const port = config.app.port;

    server.listen(port, () => {
      msg.green('🚀', `Start ZooBC API on Port ${port} Handled by Process ${process.pid}`);
    });

    process.on('SIGINT', () => {
      server.close(err => {
        require('../scheduler').stop();

        if (err) {
          msg.red('❌', `Error ZooBC API : ${err}`);
          process.exit(1);
        } else {
          msg.green('🚀', `Close ZooBC API on Port ${port} Handled by Process ${process.pid}`);
          process.exit(0);
        }
      });
    });
  }
};
