const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    BlockID: { type: String } /** ID */,
    PreviousBlockID: { type: Buffer } /** PreviousBlockHash */,
    Height: { type: Number },
    Timestamp: { type: Date },
    BlockSeed: { type: Buffer },
    BlockSignature: { type: Buffer },
    CumulativeDifficulty: { type: String },
    SmithScale: { type: Number },
    BlocksmithAddress: { type: Buffer } /** BlocksmithPublicKey */,
    TotalAmount: { type: Number },
    TotalAmountConversion: { type: Number },
    TotalFee: { type: Number },
    TotalFeeConversion: { type: Number },
    TotalCoinBase: { type: Number },
    TotalCoinBaseConversion: { type: Number },
    TotalRewards: { type: Number },
    TotalRewardsConversion: { type: Number },
    Version: { type: Number },
    PayloadLength: { type: Number },
    PayloadHash: { type: Buffer },
    BlocksmithID: { type: String } /** BlocksmithAccountAddress */,
    TotalReceipts: { type: Number },
    ReceiptValue: { type: Number },
    PopChange: { type: String },
    Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }],
    BlockReceipts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlockReceipts' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
