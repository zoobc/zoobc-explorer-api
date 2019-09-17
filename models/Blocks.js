const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  ID: { type: String },
  PreviousBlockHash: { type: Buffer },
  Height: { type: Number },
  Timestamp: { type: Date },
  BlockSeed: { type: Buffer },
  BlockSignature: { type: Buffer },
  CumulativeDifficulty: { type: String },
  SmithScale: { type: Number },
  BlocksmithAddress: { type: String },
  TotalAmount: { type: Number },
  TotalFee: { type: Number },
  TotalCoinBase: { type: Number },
  Version: { type: Number },
  PayloadLength: { type: Number },
  PayloadHash: { type: Buffer },
  Transactions: {
    type: mongoose.Schema.Types.Object,
    ref: 'Transactions.BlockID',
    field: 'ID',
  },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
