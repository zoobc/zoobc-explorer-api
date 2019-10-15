const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    NodeID: { type: String },
    NodePublicKey: { type: String },
    OwnerAddress: { type: String } /** AccountAddress */,
    NodeAddress: { type: String },
    LockedFunds: { type: String } /** LockedBalance */,
    RegisteredBlockHeight: { type: Number } /** RegistrationHeight */,
    ParticipationScore: { type: Number } /** ..waiting core */,
    RegistryStatus: { type: Boolean } /** Queued */,
    BlocksFunds: { type: Number } /** ..waiting core */,
    RewardsPaid: { type: Number } /** ..waiting core */,
    RewardsPaidConversion: { type: Number },
    Latest: { type: Boolean } /** additional */,
    Height: { type: Number } /** additional */,
    Blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blocks' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('Nodes', schema);
