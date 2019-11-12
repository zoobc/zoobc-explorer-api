const moment = require('moment');
const store = require('./Store');
const BaseController = require('./BaseController');
const { Block } = require('../Protos');
const { Converter } = require('../../utils');
const { BlocksService } = require('../../api/services');

module.exports = class Blocks extends BaseController {
  constructor() {
    super(new BlocksService());
  }

  update(callback) {
    store.blocksAddition = false;
    store.publishedReceipts = [];

    this.service.getLastHeight((err, result) => {
      if (err) return callback(`[Blocks] Blocks Service - Get Last Height ${err}`, null);

      const params = { Limit: 500, Height: result ? parseInt(result.Height + 1) : 0 };
      console.log(`?? [ZooBC] Get Blocks From Height ${params.Height}`);
      Block.GetBlocks(params, (err, result) => {
        if (err) return callback(`[Blocks] Block - Get Blocks ${err}`, null);
        if (result && result.Blocks && result.Blocks.length < 1) return callback(null, null);

        const matchs = ['BlockID', 'Height'];
        const items = result.Blocks.map(item => {
          const TotalRewards = parseFloat(item.Block.TotalCoinBase) + parseFloat(item.Block.TotalFee);
          console.log('xxx : ', item.SkippedBlocksmiths);
          return {
            BlockID: item.Block.ID,
            BlockHash: item.Block.BlockHash,
            PreviousBlockID: item.Block.PreviousBlockHash,
            Height: item.Block.Height,
            Timestamp: moment.unix(item.Block.Timestamp).valueOf(),
            BlockSeed: item.Block.BlockSeed,
            BlockSignature: item.Block.BlockSignature,
            CumulativeDifficulty: item.Block.CumulativeDifficulty,
            SmithScale: item.Block.SmithScale,
            BlocksmithID: Converter.bufferStr(item.Block.BlocksmithPublicKey),
            TotalAmount: item.Block.TotalAmount,
            TotalAmountConversion: Converter.zoobitConversion(item.Block.TotalAmount),
            TotalFee: item.Block.TotalFee,
            TotalFeeConversion: Converter.zoobitConversion(item.Block.TotalFee),
            TotalCoinBase: item.Block.TotalCoinBase,
            TotalCoinBaseConversion: Converter.zoobitConversion(item.Block.TotalCoinBase),
            Version: item.Block.Version,
            PayloadLength: item.Block.PayloadLength,
            PayloadHash: item.Block.PayloadHash,

            /** BlockExtendedInfo */
            TotalReceipts: item.TotalReceipts,
            PopChange: item.PopChange,
            ReceiptValue: item.ReceiptValue,
            BlocksmithAddress: item.BlocksmithAccountAddress,
            SkippedBlocksmiths: item.SkippedBlocksmiths,

            /** Aggregate */
            TotalRewards,
            TotalRewardsConversion: Converter.zoobitConversion(TotalRewards),

            /** Relations */
            Transactions: item.Block.Transactions,
            PublishedReceipts: item.Block.PublishedReceipts,
          };
        });

        this.service.upsert(items, matchs, (err, result) => {
          if (err) return callback(`[Blocks] Upsert ${err}`, null);
          if (result && result.ok !== 1) return callback('[Blocks] Upsert data failed', null);
          store.blocksAddition = true;
          return callback(null, `[Blocks] Upsert ${items.length} data successfully`);
        });
      });
    });
  }
};
