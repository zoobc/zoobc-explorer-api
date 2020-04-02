const cron = require('cron');
const moment = require('moment');

const config = require('../config/config');
const { msg } = require('../utils');
const { Nodes, Blocks, Accounts, Transactions, AccountTransactions, Rollback, PublishedReceipts, Resets } = require('./Controllers');

const { pubsub } = require('../graphql/subscription');

const { HealthCheck } = require('./Protos');

const nodes = new Nodes();
const resets = new Resets();
const blocks = new Blocks();
const accounts = new Accounts();
const rollback = new Rollback();
const transactions = new Transactions();
const publishedReceipts = new PublishedReceipts();
const accountTransactions = new AccountTransactions();

const reseter = false;

const events = config.app.scheduleEvent;
const cronjob = new cron.CronJob(`*/${events} * * * * *`, () => {
  // const cronjob = new cron.CronJob(`0 */${events} * * * *`, () => {
  try {
    const dateNow = moment().format('DD MMM YYYY hh:mm:ss');
    /** reset all documents - [WARNING] don't using it for production */
    if (reseter) {
      resets.all((error, result) => {
        if (error) {
          msg.red('⛔️', error);
        } else {
          msg.green('✅', `${result} at ${dateNow}`);
        }
      });
    }
    /** end: reset all documents */

    blocks.update((error, result) => {
      if (error) {
        msg.red('⛔️', error);
      } else {
        result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Blocks] Nothing additional data at ${dateNow}`);
      }

      publishedReceipts.update((error, result) => {
        if (error) {
          msg.red('⛔️', error);
        } else {
          result
            ? msg.green('✅', `${result} at ${dateNow}`)
            : msg.yellow('⚠️', `[Published Receipts] Nothing additional data at ${dateNow}`);
        }

        transactions.update((error, result) => {
          if (error) {
            msg.red('⛔️', error);
          } else {
            result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Transactions] Nothing additional data at ${dateNow}`);
          }

          nodes.update((error, result) => {
            if (error) {
              msg.red('⛔️', error);
            } else {
              result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Nodes] Nothing additional data at ${dateNow}`);
            }

            accounts.update((error, result) => {
              if (error) {
                msg.red('⛔️', error);
              } else {
                result ? msg.green('✅', `${result} at ${dateNow}`) : msg.yellow('⚠️', `[Accounts] Nothing additional data at ${dateNow}`);
              }

              accountTransactions.update((error, result) => {
                if (error) {
                  msg.red('⛔️', error);
                } else {
                  result
                    ? msg.green('✅', `${result} at ${dateNow}`)
                    : msg.yellow('⚠️', `[Account Transactions] Nothing additional data at ${dateNow}`);
                }

                rollback.checking((error, { success, info } = result) => {
                  if (error) {
                    msg.red('⛔️', error);
                  } else {
                    success
                      ? msg.green('✅', `${info} at ${dateNow}`)
                      : msg.yellow('⚠️', `${info ? `[Rollback - ${info}]` : `[Rollback]`} No data rollback at ${dateNow}`);
                  }
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    msg.red('❌', `Schedule Error.\n${error.message}`);
  }
});

const cronjobtest = new cron.CronJob(`*/${events} * * * * *`, () => {
  HealthCheck.HealthCheck(null, (err, result) => {
    if (err) {
      msg.red('⛔️', err);
    } else {
      result ? msg.green('✅', result.Reply) : msg.yellow('⚠️', `No Data`);
    }
  });
});

function start() {
  if (config.app.scheduler) {
    cronjob.start();
    msg.green('🚀', `Start Scheduler with Events Every ${events} Seconds`);
  }

  // const publishBlocks = [
  //   {
  //     BlockID: '-954299257228520262',
  //     Height: 3145,
  //     BlocksmithAddress: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
  //     Timestamp: '2020-03-26T20:42:40.000Z',
  //   },
  //   {
  //     BlockID: '-4915484907167248290',
  //     Height: 3144,
  //     BlocksmithAddress: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
  //     Timestamp: '2020-03-26T20:42:25.000Z',
  //   },
  //   {
  //     BlockID: '-4032956230954382927',
  //     Height: 3143,
  //     BlocksmithAddress: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
  //     Timestamp: '2020-03-26T20:42:10.000Z',
  //   },
  //   {
  //     BlockID: '-3543698401729295685',
  //     Height: 3142,
  //     BlocksmithAddress: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
  //     Timestamp: '2020-03-26T20:41:55.000Z',
  //   },
  //   {
  //     BlockID: '-6037846341052558026',
  //     Height: 3141,
  //     BlocksmithAddress: 'iSJt3H8wFOzlWKsy_UoEWF_OjF6oymHMqthyUMDKSyxb',
  //     Timestamp: '2020-03-26T20:41:40.000Z',
  //   },
  // ];

  // setInterval(() => {
  //   pubsub.publish('blocks', {
  //     blocks: publishBlocks,
  //   });
  // }, 10000);
}

function stop() {
  cronjob.stop();
  msg.green('🚀', 'Close Scheduler');
}

module.exports = { start, stop };
