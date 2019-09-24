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
  BlocksmithAddress: { type: Buffer } /** BlocksmithPublicKey */,
  TotalAmount: { type: Number },
  TotalFee: { type: Number },
  TotalRewards: { type: Number },
  Version: { type: Number },
  TotalReceipts: { type: Number },
  ReceiptValue: { type: Number },
  BlocksmithID: { type: String } /** BlocksmithAccountAddress */,
  PopChange: { type: String },
  PayloadLength: { type: Number },
  PayloadHash: { type: Buffer },
  TotalCoinBase: { type: Number } /** additional */,
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Blocks', schema);
