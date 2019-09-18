const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  AccountAddress: { type: String },
  Balance: { type: Number },
  SpendableBalance: { type: Number },
  FirstActive: { type: Date },
  LastActive: { type: Date },
  TotalRewards: { type: Number },
  TotalFeesPaid: { type: Number },
  NodePublicKey: { type: String },
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Accounts', schema);
