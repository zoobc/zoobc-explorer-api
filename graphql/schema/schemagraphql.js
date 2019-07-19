const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    blocks(ChainType: Int, Limit: Int, Height: Int): Blocks
    block(ChainType: Int, ID: ID, Height: Int): Block!
    transactions(Limit: Int, Offset: Int): [Transactions!]
    transaction(ID: ID): Transactions!
  }

  type Blocks {
    blocks: [Block!]
    ChainType: Int
    Count: Int
    Height: Int
  }

  type Block {
    ID: ID!
    PreviousBlockHash: String
    Height: Int
    Timestamp: String
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: String
    BlocksmithID: String
    TotalAmount: String
    TotalFee: String
    TotalCoinBase: String
    Version: Int
    PayloadLength: Int
    PayloadHash: String
    Transactions: [Transactions]
  }

  type Transactions {
    ID: ID!
    BlockID: String
    Deadline: Int
    SenderAccountType: Int
    SenderAccountAddress: String
    RecipientAccountType: Int
    RecipientAccountAddress: String
    TransactionType: Int
    Fee: String
    Timestamp: String
    TransactionHash: String
    Version: String
    TransactionBodyLength: Int
    Signature: String
    TransactionBodyBytes: String
    Height: Int
  }
`;
