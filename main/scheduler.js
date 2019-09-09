const chalk = require('chalk');
const schedule = require('node-schedule');
const config = require('../config/config');

const scheduler = async () => {
  if (config.app.scheduler) {
    const scheduleEvent = config.app.scheduleEvent;
    console.log(`%s Start schedule to execute every ${scheduleEvent} minutes`, chalk.green('🚀'));

    const s1 = schedule.scheduleJob(`*/${scheduleEvent} * * * *`, async () => {
      // await makeHttpRequest('CPU');
      console.log('Fetched new results for CPU');
    });
  }
};

module.exports = scheduler;
