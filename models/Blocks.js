const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    BlockID: { type: String } /** ID */,
    PreviousBlockHash: { type: Buffer },
    Height: { type: Number },
    Timestamp: { type: Date },
    BlockSeed: { type: Buffer },
    BlockSignature: { type: Buffer },
    CumulativeDifficulty: { type: String },
    SmithScale: { type: Number },
    BlocksmithPublicKey: { type: Buffer },
    TotalAmount: { type: Number },
    TotalFee: { type: Number },
    TotalCoinBase: { type: Number },
    TotalRewards: { type: Number },
    Version: { type: Number },
    PayloadLength: { type: Number },
    PayloadHash: { type: Buffer },
    BlocksmithAccountAddress: { type: String },
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
