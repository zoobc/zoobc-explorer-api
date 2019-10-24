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
    TotalAmountConversion: { type: String },
    TotalFee: { type: Number },
    TotalFeeConversion: { type: String },
    TotalCoinBase: { type: Number },
    TotalCoinBaseConversion: { type: String },
    TotalRewards: { type: Number },
    TotalRewardsConversion: { type: String },
    Version: { type: Number },
    PayloadLength: { type: Number },
    PayloadHash: { type: Buffer },
    BlocksmithID: { type: String } /** BlocksmithAccountAddress */,
    TotalReceipts: { type: Number },
    ReceiptValue: { type: Number },
    PopChange: { type: String },
    Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }],
    PublishedReceipts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Published_Receipts' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
