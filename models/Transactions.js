const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  TransactionID: { type: String } /** ID */,
  Timestamp: { type: Date },
  TransactionType: { type: Number },
  BlockID: { type: String },
  Height: { type: Number },
  Sender: { type: String } /** SenderAccountAddress */,
  Recipient: { type: String } /** RecipientAccountAddress */,
  Confirmations: { type: Boolean } /** ..waiting core */,
  Fee: { type: Number },
  Version: { type: Number } /** additional */,
  TransactionHash: { type: Buffer } /** additional */,
  TransactionBodyLength: { type: Number } /** additional */,
  TransactionBodyBytes: { type: Buffer } /** additional */,
  TransactionIndex: { type: Number } /** additional */,
  Signature: { type: Buffer } /** additional */,
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Transactions', schema);
