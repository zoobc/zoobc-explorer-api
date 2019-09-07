const chalk = require('chalk');
const schedule = require('node-schedule');
const request = require('request-promise');
const config = require('../config/config');

const queries = {
  PushBlocks: `
    mutation pushBlocks {
      pushBlocks {
        Blocks {
          ID
          PreviousBlockHash
          Height
          Timestamp
        }
        ChainType
        Count
        Height
      }
    }  
    `,
};

const graphqlRequest = async payload => {
  const host = `${config.app.modeServer}://${config.app.host}:${config.app.port}${config.app.mainRoute}/graphql`;
  const options = {
    uri: host,
    method: 'POST',
    json: true,
    body: {
      operationName: null,
      variables: {},
      query: queries[payload],
    },
  };
  await request(options);
};

const rule = new schedule.RecurrenceRule();
rule.minute = config.app.scheduleEvent;
const scheduleJobs = schedule.scheduleJob(rule, async () => {
  try {
    await graphqlRequest('PushBlocks');
    console.log('Fetched for push blocks');
  } catch (error) {
    console.error('Schedule Error ', error.message);
  }
});

function start() {
  if (config.app.scheduler) {
    console.log(`%s Start Schedule Event in Every ${config.app.scheduleEvent} minutes`, chalk.green('🚀'));
    scheduleJobs.reschedule();
  }
}
function stop() {
  console.log(`%s Stop Schedule Event`, chalk.red('🚀'));
  scheduleJobs.cancel();
}

const scheduler = {
  start: start(),
  stop: stop(),
};

module.exports = scheduler;
