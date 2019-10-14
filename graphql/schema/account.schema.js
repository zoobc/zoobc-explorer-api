const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    accounts(page: Int, limit: Int, order: String): Accounts!
    account(AccountAddress: String!): Account!
  }

  type Accounts {
    Accounts: [Account!]!
    Paginate: Paginate!
  }

  type Account {
    _id: ID!
    AccountAddress: String
    Balance: Float
    BalanceConversion: Float
    SpendableBalance: Float
    SpendableBalanceConversion: Float
    FirstActive: Date
    LastActive: Date
    TotalRewards: Float
    TotalRewardsConversion: Float
    TotalFeesPaid: Float
    TotalFeesPaidConversion: Float
    NodePublicKey: String
    BlockHeight: Int
    PopRevenue: String
    Latest: Boolean
  }
`;
