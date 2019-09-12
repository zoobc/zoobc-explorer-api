const chalk = require('chalk');
const cron = require('cron');

const config = require('../config/config');
const Controllers = require('./Controllers');
const controllers = new Controllers();

const events = config.app.scheduleEvent;
const cronjob = new cron.CronJob(`0 */${events} * * * *`, async () => {
  try {
    await controllers.updateBlocks();
    // await controllers.updateTransactions();
    // await controllers.updateAccount();
    // await controllers.updateNodeRegistrations();
  } catch (error) {
    console.error(`%s Schedule Error: ${error.message}`, chalk.red('🚀'));
  }
});

function start() {
  if (config.app.scheduler) {
    console.log(`%s Start Scheduler with Events Every ${events} Minutes`, chalk.green('🚀'));
    cronjob.start();
  }
}

function stop() {
  cronjob.stop();
  console.log(`%s Close Scheduler`, chalk.red('🚀'));
}

module.exports = { start, stop };
