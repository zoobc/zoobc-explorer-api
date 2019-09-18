const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    blocks(page: Int, limit: Int, fields: String, order: String): Blocks!
    block(ID: ID!): Block!
  }

  type Blocks {
    Blocks: [Block!]!
    Paginate: Paginate!
  }

  type Block {
    _id: ID!
    ID: String
    PreviousBlockHash: String
    Height: Int
    Timestamp: String
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    TotalAmount: Float
    TotalFee: Float
    TotalCoinBase: Float
    Version: Int
    PayloadLength: Int
    PayloadHash: String
    Transactions: [Transaction!]!
  }
`;
