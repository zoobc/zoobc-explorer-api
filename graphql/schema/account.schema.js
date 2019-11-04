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
    BalanceConversion: String
    SpendableBalance: Float
    SpendableBalanceConversion: String
    FirstActive: Date
    LastActive: Date
    TotalRewards: Float
    TotalRewardsConversion: String
    TotalFeesPaid: Float
    TotalFeesPaidConversion: String
    NodePublicKey: String
    BlockHeight: Int
  }
`;
