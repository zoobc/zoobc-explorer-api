const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  NodeID: { type: String },
  NodePublicKey: { type: Buffer },
  NodeAddress: { type: String },
  AccountAddress: { type: String },
  RegistrationHeight: { type: Number },
  LockedBalance: { type: String },
  Queued: { type: Boolean },
  Latest: { type: Boolean },
  Height: { type: Number },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('NodeRegistrations', schema);
