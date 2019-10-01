const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    blocks(page: Int, limit: Int, order: String, NodePublicKey: String): Blocks!
    block(BlockID: String!): Block!
  }

  type Blocks {
    Blocks: [Block!]!
    Paginate: Paginate!
  }

  type Block {
    _id: ID!
    BlockID: String
    PreviousBlockHash: String
    Height: Int
    Timestamp: Date
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    BlocksmithPublicKey: String
    TotalAmount: Float
    TotalFee: Float
    TotalCoinBase: Float
    TotalRewards: Float
    Version: Int
    PayloadLength: Int
    PayloadHash: String
    BlocksmithAccountAddress: String
    TotalReceipts: Float
    ReceiptValue: Float
    PopChange: String
  }
`;
