const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema({
  _id: { type: String },
  AccountAddress: { type: String },
  Balance: { type: Number },
  SpendableBalance: { type: Number },
  FirstActive: { type: Date } /** ..waiting core */,
  LastActive: { type: Date } /** ..waiting core */,
  TotalRewards: { type: Number } /** ..waiting core */,
  TotalFeesPaid: { type: Number } /** ..waiting core */,
  NodePublicKey: { type: String },
  BlockHeight: { type: Number } /** additional */,
  PopRevenue: { type: Buffer } /** additional */,
});

schema.plugin(upsertMany);

module.exports = mongoose.model('Accounts', schema);
