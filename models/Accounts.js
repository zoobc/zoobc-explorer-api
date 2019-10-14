const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    _id: { type: String },
    AccountAddress: { type: String },
    Balance: { type: Number },
    BalanceConversion: { type: Number },
    SpendableBalance: { type: Number },
    SpendableBalanceConversion: { type: Number },
    FirstActive: { type: Date } /** ..waiting core */,
    LastActive: { type: Date } /** ..waiting core */,
    TotalRewards: { type: Number } /** ..waiting core */,
    TotalRewardsConversion: { type: Number },
    TotalFeesPaid: { type: Number } /** ..waiting core */,
    TotalFeesPaidConversion: { type: Number },
    NodePublicKey: { type: String },
    BlockHeight: { type: Number } /** additional */,
    PopRevenue: { type: Buffer } /** additional */,
    Latest: { type: Boolean },
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('Accounts', schema);
