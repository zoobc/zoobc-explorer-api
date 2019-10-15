const mongoose = require('mongoose');
const { upsertMany } = require('../utils');

const schema = new mongoose.Schema(
  {
    AccountAddress: { type: String },
    Balance: { type: Number },
    BalanceConversion: { type: Number },
    SpendableBalance: { type: Number },
    SpendableBalanceConversion: { type: Number },
    FirstActive: { type: Date },
    LastActive: { type: Date },
    TotalRewards: { type: Number },
    TotalRewardsConversion: { type: Number },
    TotalFeesPaid: { type: Number },
    TotalFeesPaidConversion: { type: Number },
    BlockHeight: { type: Number },
    Nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Nodes' }],
    Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transactions' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

schema.plugin(upsertMany);

module.exports = mongoose.model('Accounts', schema);
