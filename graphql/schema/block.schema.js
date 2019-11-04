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
    PreviousBlockID: String
    Height: Int
    Timestamp: Date
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    BlocksmithAddress: String
    TotalAmount: Float
    TotalAmountConversion: String
    TotalFee: Float
    TotalFeeConversion: String
    TotalCoinBase: Float
    TotalCoinBaseConversion: String
    TotalRewards: Float
    TotalRewardsConversion: String
    Version: Int
    PayloadLength: Int
    PayloadHash: String
    BlocksmithID: String
    TotalReceipts: Float
    ReceiptValue: Float
    PopChange: String
  }
`;
