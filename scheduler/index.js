const cron = require('cron');
const moment = require('moment');

const config = require('../config/config');
const Controllers = require('./Controllers');
const { msg } = require('../utils');

const controllers = new Controllers();
const events = config.app.scheduleEvent;

const cronjob = new cron.CronJob(`0 */${events} * * * *`, () => {
  try {
    const dateNow = moment().format('DD MMM YYYY hh:mm:ss');
    controllers.updateBlocks((error, result) => {
      if (error) {
        msg.red('⛔️', error);
      } else {
        result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Blocks] Nothing additional data at ${dateNow}`);
      }

      controllers.updateTransactions((error, result) => {
        if (error) {
          msg.red('⛔️', error);
        } else {
          result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Transactions] Nothing additional data at ${dateNow}`);
        }

        controllers.updateNodes((error, result) => {
          if (error) {
            msg.red('⛔️', error);
          } else {
            result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Nodes] Nothing additional data at ${dateNow}`);
          }
        });

        controllers.updateAccounts((error, result) => {
          if (error) {
            msg.red('⛔️', error);
          } else {
            result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Accounts] Nothing additional data at ${dateNow}`);
          }
        });
      });
    });
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
