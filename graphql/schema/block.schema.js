const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    blocks(page: Int, limit: Int, order: String, NodePublicKey: String): Blocks!
    block(BlockID: String!): Block!
  }

  extend type Mutation {
    blocks: String!
  }

  extend type Subscription {
    blocks: [Block!]!
  }

  type Blocks {
    Blocks: [Block!]!
    Paginate: Paginate!
  }
  type Block {
    # Block
    _id: ID!
    BlockID: String
    BlockHash: String
    PreviousBlockID: String
    Height: Int
    Timestamp: Date
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    BlocksmithID: String
    TotalAmount: Float
    TotalAmountConversion: String
    TotalFee: Float
    TotalFeeConversion: String
    TotalCoinBase: Float
    TotalCoinBaseConversion: String
    Version: Int
    PayloadLength: Int
    PayloadHash: String

    # BlockExtendedInfo
    TotalReceipts: Float
    ReceiptValue: Float
    PopChange: String
    BlocksmithAddress: String
    SkippedBlocksmiths: [SkippedBlocksmith!]

    # Aggregate
    TotalRewards: Float
    TotalRewardsConversion: String

    PublishedReceipts: [PublishedReceipt!]

    TotalTransaction: Int
  }
  type SkippedBlocksmith {
    BlocksmithPublicKey: String
    POPChange: String
    BlockHeight: Int
    BlocksmithIndex: Int
  }

  type PublishedReceipt {
    BatchReceipt: BatchReceipt!
    IntermediateHashes: String
    BlockHeight: Int
    ReceiptIndex: Int
    PublishedIndex: Int
  }

  type BatchReceipt {
    SenderPublicKey: String
    RecipientPublicKey: String
    DatumType: Int
    DatumHash: String
    ReferenceBlockHeight: Int
    ReferenceBlockHash: String
    RMRLinked: String
    RecipientSignature: String
  }
`
