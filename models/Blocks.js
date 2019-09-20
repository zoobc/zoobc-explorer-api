const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  BlockID: { type: String } /** ID */,
  Height: { type: Number },
  Timestamp: { type: Date },
  PreviousBlockID: { type: Buffer } /** PreviousBlockHash */,
  BlockSeed: { type: Buffer },
  BlockSignature: { type: Buffer },
  CumulativeDifficulty: { type: String },
  SmithScale: { type: Number },
  BlocksmithAddress: { type: String },
  TotalAmount: { type: Number },
  TotalFee: { type: Number },
  TotalRewards: { type: Number } /** ..waiting core */,
  Version: { type: Number },
  TotalReceipts: { type: Number } /** ..waiting core */,
  ReceiptValue: { type: Number } /** ..waiting core */,
  BlocksmithID: { type: Buffer },
  PoPChange: { type: String } /** ..waiting core */,
  PayloadLength: { type: Number },
  PayloadHash: { type: Buffer },
  TotalCoinBase: { type: Number } /** additional */,
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
