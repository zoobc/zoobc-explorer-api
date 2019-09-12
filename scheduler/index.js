const chalk = require('chalk');
const cron = require('cron');
// const moment = require('moment');
// const request = require('request-promise');

const config = require('../config/config');
const Controllers = require('./Controllers');
const controllers = new Controllers();

const events = config.app.scheduleEvent;
const cronjob = new cron.CronJob(`0 */${events} * * * *`, async () => {
  try {
    await controllers.updateBlocks();
    // await graphqlRequest('PushBlocks');
    // console.log(`%s Fetched for push blocks at ${moment().format('DD-MM-YYYY hh:mm')}`, chalk.green('🚀'));
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

// module.exports = started => {
//   console.log('====s', started);

//   if (config.app.scheduler) {
//     const events = config.app.scheduleEvent;
//     console.log(`%s Start Scheduler with Events Every ${events} Minutes`, chalk.green('🚀'));
//   }
// };

// const queries = {
//   PushBlocks: `
//     mutation pushBlocks {
//       pushBlocks {
//         Blocks {
//           ID
//           PreviousBlockHash
//           Height
//           Timestamp
//         }
//         ChainType
//         Count
//         Height
//       }
//     }
//     `,
// };

// const graphqlRequest = async payload => {
//   const host = `${config.app.modeServer}://${config.app.host}:${config.app.port}${config.app.mainRoute}/graphql`;
//   const options = {
//     uri: host,
//     method: 'POST',
//     json: true,
//     body: {
//       operationName: null,
//       variables: {},
//       query: queries[payload],
//     },
//   };
//   await request(options);
// };

// const CronJob = cron.CronJob;
// const scheduler = config.app.scheduler
//   ? new CronJob(`0 */${config.app.scheduleEvent} * * * *`, async () => {
//       try {
//         await graphqlRequest('PushBlocks');
//         console.log(`%s Fetched for push blocks at ${moment().format('DD-MM-YYYY hh:mm')}`, chalk.green('🚀'));
//       } catch (error) {
//         console.error(`%s Schedule Error: ${error.message}`, chalk.red('🚀'));
//       }
//     })
//   : null;

// module.exports = scheduler;
