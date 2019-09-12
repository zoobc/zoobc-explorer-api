const chalk = require('chalk');

const { BlocksService, TransactionsService } = require('../api/services');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');

module.exports = class Controllers {
  constructor() {
    this.blocksService = new BlocksService();
    this.transactionsService = new TransactionsService();
  }

  async updateBlocks() {
    this.blocksService.getLastHeight((err, resp) => {
      if (err) {
        console.error('%s Get last height blocks - %s', chalk.red('✗'), err);
        return;
      }

      const Height = resp ? parseInt(resp.Height + 1) : 0;
      const params = { Limit: 250, Height };
      Block.GetBlocks(params, async (err, resp) => {
        if (err) {
          console.error('%s Get blocks - %s', chalk.red('✗'), err);
          return;
        }

        if (resp) {
          const items = resp.Blocks;
          const matchs = ['Height'];
          this.blocksService.upsert(items, matchs, (err, result) => {
            if (err) {
              console.error('%s Upsert blocks - %s', chalk.red('✗'), err);
              return;
            }
            if (!result) {
              console.log(`%s Nothing upsert blocks`, chalk.green('🚀'));
              return;
            }
            if (result && result.ok === 1) {
              console.log(`%s Upsert ${items.length} blocks successfully`, chalk.green('🚀'));
              return;
            }
            console.error('%s Upsert blocks failed', chalk.red('✗'));
          });
        }
      });
    });
  }

  async updateTransactions() {
    this.transactionsService.getLastHeight((err, resp) => {
      if (err) {
        console.error('%s Get last height transactions - %s', chalk.red('✗'), err);
        return;
      }

      const Height = resp ? parseInt(resp.Height + 1) : 0;
      const params = { Pagination: { Limit: 1, OrderField: 'block_height', OrderBy: 'ASC' } };
      Transaction.GetTransactions(params, async (err, resp) => {
        if (err) {
          console.error('%s Get transactions - %s', chalk.red('✗'), err);
          return;
        }

        console.log('===resp', resp);
      });
    });
  }

  async updateAccount() {
    console.log('==AccountBalance', AccountBalance);
    const params = { BlockHeight: 1 };
    AccountBalance.GetAccountBalances(params, async (err, resp) => {
      if (err) {
        console.error('%s Get account balances - %s', chalk.red('✗'), err);
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
        console.error('%s Get node registrations - %s', chalk.red('✗'), err);
        return;
      }

      console.log('===resp', resp);
    });
  }
};
