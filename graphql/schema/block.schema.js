const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    blocks(page: Int, limit: Int, order: String): Blocks!
    block(BlockID: ID!): Block!
  }

  type Blocks {
    Blocks: [Block!]!
    Paginate: Paginate!
  }

  type Block {
    _id: ID!
    BlockID: String
    Height: Int
    Timestamp: String
    PreviousBlockID: String
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    BlocksmithAddress: String
    TotalAmount: Float
    TotalFee: Float
    TotalRewards: Float
    Version: Int
    TotalReceipts: Float
    ReceiptValue: Float
    BlocksmithID: String
    PoPChange: String
    PayloadLength: Int
    PayloadHash: String
    TotalCoinBase: Float
  }
`;
