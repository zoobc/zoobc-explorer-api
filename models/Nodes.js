const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  NodePublicKey: { type: String },
  OwnerAddress: { type: String } /** AccountAddress */,
  NodeAddress: { type: String },
  LockedFunds: { type: String } /** LockedBalance */,
  RegisteredBlockHeight: { type: Number } /** RegistrationHeight */,
  ParticipationScore: { type: Number } /** ..waiting core */,
  RegistryStatus: { type: Boolean } /** Queued */,
  BlocksFunds: { type: Number } /** ..waiting core */,
  RewardsPaid: { type: Number } /** ..waiting core */,
  Latest: { type: Boolean } /** additional */,
  Height: { type: Number } /** additional */,
  NodeID: { type: String } /** additional */,
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Nodes', schema);
