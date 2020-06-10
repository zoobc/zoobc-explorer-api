const mongoose = require('mongoose');
const { upserts } = require('../utils');

const schema = new mongoose.Schema(
  {
    IntermediateHashes: { type: String },
    BlockHeight: { type: Number },
    ReceiptIndex: { type: Number },
    PublishedIndex: { type: Number },
    BatchReceipt: {
      SenderPublicKey: { type: String },
      RecipientPublicKey: { type: String },
      DatumType: { type: Number },
      DatumHash: { type: Buffer },
      ReferenceBlockHeight: { type: Number },
      ReferenceBlockHash: { type: Buffer },
      RMRLinked: { type: Buffer },
      RecipientSignature: { type: Buffer },
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upserts);

module.exports = mongoose.model('Published_Receipts', schema);
