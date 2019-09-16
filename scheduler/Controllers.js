const { msg } = require('../utils');
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
        msg.red('⛔️', `Get last height blocks - ${err}`);
        return;
      }

      const Height = resp ? parseInt(resp.Height + 1) : 0;
      const params = { Limit: 250, Height };
      Block.GetBlocks(params, async (err, resp) => {
        if (err) {
          msg.red('⛔️', `Get blocks - ${err}`);
          return;
        }

        if (resp) {
          const items = resp.Blocks;
          const matchs = ['Height'];
          this.blocksService.upsert(items, matchs, (err, result) => {
            if (err) {
              msg.red('⛔️', `Upsert blocks - ${err}`);
              return;
            }

            if (!result) {
              msg.yellow('⚠️', 'Nothing additional blocks');
              return;
            }

            if (result && result.ok === 1) {
              msg.green('✅', `Upsert ${items.length} blocks successfully`);
              return;
            }

            msg.red('⛔️', 'Upsert blocks failed');
          });
        }
      });
    });
  }

  async updateTransactions() {
    this.transactionsService.getLastHeight((err, resp) => {
      if (err) {
        msg.red('⛔️', `Get last height transactions - ${err}`);
        return;
      }

      const Height = resp ? parseInt(resp.Height + 1) : 0;
      const params = { Pagination: { Limit: 1, OrderField: 'block_height', OrderBy: 'ASC' } };
      Transaction.GetTransactions(params, async (err, resp) => {
        if (err) {
          msg.red('⛔️', `Get transactions - ${err}`);
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
