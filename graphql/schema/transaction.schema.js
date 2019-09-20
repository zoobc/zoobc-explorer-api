const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    transactions(page: Int, limit: Int, order: String): Transactions!
    transaction(ID: ID!): Transaction!
  }

  type Transactions {
    Transactions: [Transaction!]!
    Paginate: Paginate!
  }

  type Transaction {
    _id: ID!
    Version: Int
    ID: String
    BlockID: String
    Height: Int
    SenderAccountAddress: String
    RecipientAccountAddress: String
    TransactionType: Int
    Fee: Float
    Timestamp: String
    TransactionHash: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    TransactionIndex: Int
    Signature: String
  }
`;
