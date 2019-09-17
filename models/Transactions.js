const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  ID: { type: String },
  BlockID: { type: String },
  Version: { type: Number },
  Height: { type: Number },
  SenderAccountAddress: { type: String },
  RecipientAccountAddress: { type: String },
  TransactionType: { type: Number },
  Fee: { type: Number },
  Timestamp: { type: Date },
  TransactionHash: { type: Buffer },
  TransactionBodyLength: { type: Number },
  TransactionBodyBytes: { type: Buffer },
  TransactionIndex: { type: Number },
  Signature: { type: Buffer },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Transactions', schema);
