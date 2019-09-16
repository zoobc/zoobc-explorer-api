const cron = require('cron');

const config = require('../config/config');
const Controllers = require('./Controllers');
const { msg } = require('../utils');

const controllers = new Controllers();
const events = config.app.scheduleEvent;
// const cronjob = new cron.CronJob(`20 * * * * *`, async () => {
const cronjob = new cron.CronJob(`0 */${events} * * * *`, async () => {
  try {
    await controllers.updateBlocks();
    await controllers.updateTransactions();
    // await controllers.updateAccount();
    // await controllers.updateNodeRegistrations();
  } catch (error) {
    msg.red('❌', `Schedule Error.\n${error.message}`);
  }
});

function start() {
  if (config.app.scheduler) {
    msg.green('🚀', `Start Scheduler with Events Every ${events} Minutes`);
    cronjob.start();
  }
}

function stop() {
  cronjob.stop();
  msg.green('🚀', 'Close Scheduler');
}

module.exports = { start, stop };
