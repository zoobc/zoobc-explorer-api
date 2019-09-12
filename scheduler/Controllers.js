const chalk = require('chalk');

const { BlocksService } = require('../api/services');
const { Block } = require('./Protos');

module.exports = class Controllers {
  constructor() {
    this.blocksService = new BlocksService();
  }

  async updateBlocks() {
    this.blocksService.getLastHeight((err, resp) => {
      if (err) {
        console.error('%s Get Last Height - %s', chalk.red('✗'), err);
        return;
      }
      const Height = resp ? parseInt(resp.Height + 1) : 1;
      const params = { ChainType: 0, Limit: 250, Height };
      Block.GetBlocks(params, async (err, resp) => {
        if (err) {
          console.error('%s Get Blocks - %s', chalk.red('✗'), err);
          return;
        }

        if (resp) {
          const items = resp.Blocks;
          const matchs = ['Height'];
          this.blocksService.upsert(items, matchs, (err, result) => {
            if (err) {
              console.error('%s Upsert Blocks - %s', chalk.red('✗'), err);
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

            console.error('%s Upsert Blocks failed', chalk.red('✗'));
          });
        }
      });
    });
  }
};
