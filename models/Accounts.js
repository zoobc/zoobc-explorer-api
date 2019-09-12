const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const { Schema } = mongoose;
const schema = new Schema({
  AccountAddress: { type: String },
  BlockHeight: { type: Number },
  SpendableBalance: { type: String },
  Balance: { type: String },
  PopRevenue: { type: String },
  Latest: { type: Boolean },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Accounts', schema);
