const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  ID: { type: String },
  PreviousBlockHash: { type: Buffer },
  Height: { type: Number },
  Timestamp: { type: String },
  BlockSeed: { type: Buffer },
  BlockSignature: { type: Buffer },
  CumulativeDifficulty: { type: String },
  SmithScale: { type: String },
  BlocksmithAddress: { type: String },
  TotalAmount: { type: String },
  TotalFee: { type: String },
  TotalCoinBase: { type: String },
  Version: { type: Number },
  PayloadLength: { type: Number },
  PayloadHash: { type: Buffer },
  Transactions: { type: Array },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
