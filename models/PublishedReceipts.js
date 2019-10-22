const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    BatchReceipt: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BatchReceipt' }],
    Hashes: { type: String } /** IntermediateHashes */,
    Height: { type: Number } /** BlockHeight */,
    ReceiptIndex: { type: Number } /** ReceiptIndex */,
    PublishedIndex: { type: Number } /** PublishedIndex */,
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('PublishedReceipt', schema);
