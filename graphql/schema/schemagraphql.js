const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    blocks(ChainType: Int, Limit: Int, Height: Int): Blocks
    block(ChainType: Int, ID: ID, Height: Int): Block!
    transactions(Limit: Int, Page: Int, AccountAddress: String): Transactions
    transaction(ID: ID): Transaction!
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
    Transactions: [Transaction]
  }

  type Transactions {
    Transactions: [Transaction!]
    Total: Int
  }

  type Transaction {
    Version: Int
    ID: ID!
    BlockID: String
    Height: Int
    SenderAccountAddress: String
    RecipientAccountAddress: String
    TransactionType: String
    Fee: String
    Timestamp: String
    TransactionHash: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    Signature: String
  }
`;
