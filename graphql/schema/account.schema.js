const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    accounts(page: Int, limit: Int, order: String): Accounts!
    account(AccountAddress: ID!): Account!
  }

  type Accounts {
    Accounts: [Account!]!
    Paginate: Paginate!
  }

  type Account {
    _id: ID!
    AccountAddress: String
    Balance: Float
    SpendableBalance: Float
    FirstActive: String
    LastActive: String
    TotalRewards: Float
    TotalFeesPaid: Float
    NodePublicKey: String
  }
`;
