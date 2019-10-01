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
  /** convertion by transaction body */
  TransactionTypeName: { type: String },
  SendMoney: {
    Amount: { type: Number },
  },
  ClaimNodeRegistration: {
    NodePublicKey: { type: String },
    AccountAddress: { type: String },
    ProofOfOwnership: {
      MessageBytes: { type: Buffer },
      Signature: { type: Buffer },
    },
  },
  NodeRegistration: {
    NodePublicKey: { type: String },
    AccountAddress: { type: String },
    NodeAddress: { type: String },
    LockedBalance: { type: Number },
    ProofOfOwnership: {
      MessageBytes: { type: Buffer },
      Signature: { type: Buffer },
    },
  },
  RemoveNodeRegistration: {
    NodePublicKey: { type: String },
  },
  UpdateNodeRegistration: {
    NodePublicKey: { type: String },
    NodeAddress: { type: String },
    LockedBalance: { type: Number },
    ProofOfOwnership: {
      MessageBytes: { type: Buffer },
      Signature: { type: Buffer },
    },
  },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Transactions', schema);
