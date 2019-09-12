const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const { Schema } = mongoose;
const schema = new Schema({
  NodeID: { type: String },
  NodePublicKey: { type: Buffer},
  AccountAddress: { type: String },
  RegistrationHeight: { type: Number },
  NodeAddress: { type: String },
  LockedBalance: { type: String },
  Queued: { type: Boolean },
  Latest: { type: Boolean },
  Height: { type: Number },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Nodes', schema);
