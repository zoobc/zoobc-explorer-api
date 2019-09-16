const moment = require('moment');
const { msg } = require('../utils');
const { BlocksService, TransactionsService } = require('../api/services');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');

const dateNow = moment().format('DD MMM YYYY hh:mm:ss');
module.exports = class Controllers {
  constructor() {
    this.blocksService = new BlocksService();
    this.transactionsService = new TransactionsService();
  }

  async updateBlocks() {
    this.blocksService.getLastHeight((err, resp) => {
      if (err) {
        msg.red('⛔️', `[Blocks] blocksService.getLastHeight: ${err}`);
        return;
      }

      const Height = resp ? parseInt(resp.Height + 1) : 0;
      const params = { Limit: 500, Height };
      Block.GetBlocks(params, async (err, resp) => {
        if (err) {
          msg.red('⛔️', `[Blocks] Block.GetBlocks: ${err}`);
          return;
        }

        if (resp && resp.Blocks && resp.Blocks.length > 0) {
          const matchs = ['Height'];
          const items = resp.Blocks.map(item => {
            item.Timestamp = moment.unix(item.Timestamp).valueOf();
            return item;
          });
          this.blocksService.upsert(items, matchs, (err, result) => {
            if (err) {
              msg.red('⛔️', `[Blocks] blocksService.upsert: ${err}`);
              return;
            }

            if (result && result.ok === 1) {
              msg.green('✅', `[Blocks] Upsert ${items.length} data successfully at ${dateNow}`);
              return;
            }

            msg.red('⛔️', `[Blocks] Upsert data failed at ${dateNow}`);
            return;
          });
        } else {
          msg.yellow('⚠️', `[Blocks] Nothing additional data at ${dateNow}`);
          return;
        }
      });
    });
  }

  async updateTransactions() {
    function GetTransactionsByHeight(Height, callback) {
      const params = { Height, Pagination: { OrderField: 'block_height', OrderBy: 'ASC' } };
      Transaction.GetTransactions(params, (err, resp) => {
        if (err) {
          callback(`[Transactions] Transaction.GetTransactions(Height=${Height}): ${err}`, null);
          return;
        }

        if (resp && resp.Transactions && resp.Transactions.length > 0) {
          const result = resp.Transactions.filter(item => item.Height === Height && item);
          callback(null, result);
          return;
        } else {
          callback(null, null);
          return;
        }
      });
    }

    this.transactionsService.getLastHeight((err, result) => {
      if (err) {
        msg.red('⛔️', `[Transactions] transactionsService.getLastHeight: ${err}`);
        return;
      }

      if (!result) {
        const Height = 0;
        GetTransactionsByHeight(Height, (err, resp) => {
          if (err) {
            msg.red('⛔️', err);
            return;
          }

          if (resp && resp.length > 0) {
            const matchs = ['ID', 'BlockID', 'Height'];
            const items = resp.map(item => {
              item.Timestamp = moment.unix(item.Timestamp).valueOf();
              return item;
            });
            this.transactionsService.upsert(items, matchs, (err, result) => {
              if (err) {
                msg.red('⛔️', `[Transactions - Height ${Height}] transactionsService.upsert: ${err}`);
              }

              if (result && result.ok === 1) {
                msg.green('✅', `[Transactions - Height ${Height}] Upsert ${items.length} data successfully at ${dateNow}`);
                return;
              }

              msg.red('⛔️', `[Transactions - Height ${Height}] Upsert data failed at ${dateNow}`);
              return;
            });
          } else {
            msg.yellow('⚠️', `[Transactions - Height ${Height}] Nothing additional data at ${dateNow}`);
            return;
          }
        });
      } else {
        const unixDaysBefore = moment()
          .subtract(7, 'days')
          .valueOf();
        const paramsDaysBefore = { fields: 'ID,Height,Timestamp', where: { Timestamp: { $gte: unixDaysBefore } }, order: 'Height' };
        this.blocksService.findAll(paramsDaysBefore, (err, result) => {
          if (err) {
            msg.red('⛔️', `[Transactions] blocksService.findAll(Timestamp=7daysbefore): ${err}`);
            return;
          }

          if (result && result.length > 0) {
            result.map(item => {
              GetTransactionsByHeight(item.Height, (err, resp) => {
                if (err) {
                  msg.red('⛔️', err);
                  return;
                }

                if (resp && resp.length > 0) {
                  const matchs = ['ID', 'BlockID', 'Height'];
                  const items = resp.map(item => {
                    item.Timestamp = moment.unix(item.Timestamp).valueOf();
                    return item;
                  });
                  this.transactionsService.upsert(items, matchs, (err, result) => {
                    if (err) {
                      msg.red('⛔️', `[Transactions - Height ${item.Height}] transactionsService.upsert: ${err}`);
                    }

                    if (result && result.ok === 1) {
                      msg.green('✅', `[Transactions - Height ${item.Height}] Upsert ${items.length} data successfully at ${dateNow}`);
                      return;
                    }

                    msg.red('⛔️', `[Transactions - Height ${item.Height}] Upsert data failed at ${dateNow}`);
                    return;
                  });
                } else {
                  msg.yellow('⚠️', `[Transactions - Height ${item.Height}] Nothing additional data at ${dateNow}`);
                  return;
                }
              });
            });
          }
        });
      }
    });
  }

  async updateAccount() {
    console.log('==AccountBalance', AccountBalance);
    const params = { BlockHeight: 1 };
    AccountBalance.GetAccountBalances(params, async (err, resp) => {
      if (err) {
        msg.red('⛔️', `Get account balances - ${err}`);
        return;
      }

      console.log('===resp', resp);
    });
  }

  async updateNodeRegistrations() {
    console.log('====Node', NodeRegistration);
    const params = { RegistrationHeight: 1 };
    NodeRegistration.GetNodeRegistrations(params, async (err, resp) => {
      if (err) {
        msg.red('⛔️', `Get node registrations - ${err}`);
        return;
      }

      console.log('===resp', resp);
    });
  }
};
