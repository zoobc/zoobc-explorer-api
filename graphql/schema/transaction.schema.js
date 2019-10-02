const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    transactions(page: Int, limit: Int, order: String, BlockID: String, AccountAddress: String): Transactions!
    transaction(TransactionID: String!): Transaction!
  }

  type Transactions {
    Transactions: [Transaction!]!
    Paginate: Paginate!
  }

  type Transaction {
    _id: ID!
    TransactionID: String
    Timestamp: Date
    TransactionType: Int
    BlockID: String
    Height: Int
    Sender: String
    Recipient: String
    Confirmations: Boolean
    Fee: Float
    FeeConversion: Float
    Version: Int
    TransactionHash: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    TransactionIndex: Int
    Signature: String
    Block: Block!
  }
`;
