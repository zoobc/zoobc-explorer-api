const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  AccountAddress: { type: String },
  BlockHeight: { type: Number },
  SpendableBalance: { type: String },
  Balance: { type: String },
  PopRevenue: { type: String },
  Latest: { type: Boolean },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('AccountBalances', schema);
