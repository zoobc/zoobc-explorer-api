const moment = require('moment');
const { msg } = require('../utils');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');
const { BlocksService, TransactionsService, AccountsService } = require('../api/services');

const dateNow = moment().format('DD MMM YYYY hh:mm:ss');

module.exports = class Controllers {
  constructor() {
    this.blocksService = new BlocksService();
    this.transactionsService = new TransactionsService();
    this.accountsService = new AccountsService();
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

    function UpsertTransactions(service, datas, Height) {
      const matchs = ['ID', 'BlockID', 'Height'];
      const items = datas.map(item => {
        item.Timestamp = moment.unix(item.Timestamp).valueOf();
        return item;
      });

      service.upsert(items, matchs, (err, result) => {
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
            UpsertTransactions(this.transactionsService, resp, Height);
          } else {
            msg.yellow('⚠️', `[Transactions - Height ${Height}] Nothing additional data at ${dateNow}`);
            return;
          }
        });
      } else {
        const paramsTransactions = { fields: 'ID,Height,Timestamp', where: { Height: { $gte: 1 } }, order: 'Height' };
        this.transactionsService.findAll(paramsTransactions, (err, result) => {
          if (err) {
            msg.red('⛔️', `[Transactions] transactionsService.findAll(Height>=1): ${err}`);
            return;
          }

          if (result && result.length > 0) {
            this.blocksService.getLastHeight((err, result) => {
              if (err) {
                msg.red('⛔️', `[Transactions] blocksService.getLastHeight: ${err}`);
                return;
              }

              if (result) {
                const paramsHeight = result.Height;
                GetTransactionsByHeight(paramsHeight, (err, resp) => {
                  if (err) {
                    msg.red('⛔️', `[Transactions] GetTransactionsByHeight(Height=${paramsHeight}): ${err}`);
                    return;
                  }

                  if (resp && resp.length > 0) {
                    UpsertTransactions(this.transactionsService, resp, paramsHeight);
                  } else {
                    msg.yellow('⚠️', `[Transactions - Height ${paramsHeight}] Nothing additional data at ${dateNow}`);
                    return;
                  }
                });
              }
            });
          } else {
            const paramsBlocks = { fields: 'ID,Height,Timestamp', order: 'Height' };
            this.blocksService.findAll(paramsBlocks, (err, result) => {
              if (err) {
                msg.red('⛔️', `[Transactions] blocksService.findAll: ${err}`);
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
                      UpsertTransactions(this.transactionsService, resp, item.Height);
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

  async updateAccount() {
    function UpsertAccount(service, data) {
      const matchs = ['AccountAddress'];
      const items = [
        {
          AccountAddress: data.AccountAddress,
          Balance: data.Balance,
          SpendableBalance: data.SpendableBalance,
          FirstActive: null,
          LastActive: null,
          TotalRewards: null,
          TotalFeesPaid: null,
          NodePublicKey: null,
          BlockHeight: data.BlockHeight,
          PopRevenue: data.PopRevenue,
        },
      ];

      service.upsert(items, matchs, (err, result) => {
        if (err) {
          msg.red('⛔️', `[Account] accountsService.upsert: ${err}`);
        }

        if (result && result.ok === 1) {
          msg.green('✅', `[Account] Upsert ${items.length} data successfully at ${dateNow}`);
          return;
        }

        msg.red('⛔️', `[Account] Upsert data failed at ${dateNow}`);
        return;
      });
    }

    this.accountsService.findAll({}, (err, results) => {
      if (err) {
        msg.red('⛔️', `[Account] accountsService.findAll: ${err}`);
        return;
      }

      if (results && results.length > 0) {
        const accounts = results.map(item => item.AccountAddress);
        this.transactionsService.getAccountsByLastHeight((err, results) => {
          if (err) {
            msg.red('⛔️', `[Account] transactionsService.getAccountsByLastHeight: ${err}`);
            return;
          }

          const newAccounts = results.filter(item => !accounts.includes(item));
          if (results && newAccounts && newAccounts.length > 0) {
            newAccounts.map(account => {
              AccountBalance.GetAccountBalance({ AccountAddress: account }, (err, resp) => {
                if (err) {
                  msg.red('⛔️', `[Account] AccountBalance.GetAccountBalance(AccountAddress=${results}): ${err}`);
                  return;
                }

                if (resp && resp.AccountBalance) {
                  UpsertAccount(this.accountsService, resp.AccountBalance);
                }
              });
            });
          } else {
            msg.yellow('⚠️', `[Account] Nothing additional data at ${dateNow}`);
            return;
          }
        });
      } else {
        this.transactionsService.getAccountsFromTransactions((err, results) => {
          if (err) {
            msg.red('⛔️', `[Account] transactionsService.getAccountsFromTransactions: ${err}`);
            return;
          }

          if (results && results.length > 0) {
            results.map(account => {
              AccountBalance.GetAccountBalance({ AccountAddress: account }, (err, resp) => {
                if (err) {
                  msg.red('⛔️', `[Account] AccountBalance.GetAccountBalance(AccountAddress=${account}): ${err}`);
                  return;
                }

                if (resp && resp.AccountBalance) {
                  UpsertAccount(this.accountsService, resp.AccountBalance);
                }
              });
            });
          } else {
            msg.yellow('⚠️', `[Account] Nothing additional data at ${dateNow}`);
            return;
          }
        });
      }
    });
  }
};
