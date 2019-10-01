const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    BlockID: { type: String },
    Height: { type: Number },
    SenderPublicKey: { type: String },
    ReceiverPublicKey: { type: String },
    DataType: { type: String },
    DataHash: { type: Buffer },
    ReceiptMerkleRoot: { type: String },
    ReceiverSignature: { type: String },
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('BlockReceipts', schema);
