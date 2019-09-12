const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  Version: { type: Number },
  ID: { type: String },
  BlockID: { type: String },
  Height: { type: Number, },
  SenderAccountAddress: { type: String },
  RecipientAccountAddress: { type: String },
  TransactionType: { type: Number },
  Fee: { type: String },
  Timestamp: { type: String},
  TransactionHash: { type: Buffer },
  TransactionBodyLength: { type: Number },
  TransactionBodyBytes: { type: Buffer },
  TransactionIndex: { type: Number },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Transactions', schema);
