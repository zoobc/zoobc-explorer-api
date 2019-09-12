const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  NodeID: { type: String },
  NodePublicKey: { type: Buffer },
  AccountAddress: { type: String },
  RegistrationHeight: { type: Number },
  NodeAddress: { type: String },
  LockedBalance: { type: String },
  Queued: { type: Boolean },
  Latest: { type: Boolean },
  Height: { type: Number },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('NodeRegistrations', schema);
