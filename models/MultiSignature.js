const mongoose = require('mongoose');
const { upserts } = require('../utils');

const schema = new mongoose.Schema(
  {
    MultiSignature: {
      MultiSignatureInfo: {
        MinimumSignatures: { type: Number },
        Nonce: { type: String },
        Addresses: {
          type: [String],
          default: undefined,
        },
        MultisigAddress: { type: String },
        BlockHeight: { type: Number },
        Latest: { type: Boolean },
      },
      UnsignedTransactionBytes: { type: Buffer },
      SignatureInfo: {
        TransactionHash: { type: Buffer },
        Signatures: {
          type: Map,
          of: Buffer,
        },
      },
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upserts);

module.exports = mongoose.model('Multi_Signature', schema);
