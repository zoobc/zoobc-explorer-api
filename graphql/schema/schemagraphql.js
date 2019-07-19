const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
<<<<<<< HEAD
    block(ChainType: Int, Limit: Int, Height: Int): Block
    transactions(Limit: Int, Offset: Int): [Transactions!]
    transaction(ID: ID): Transactions!
    accountBalances: [AccountBalance!]
    accountBalance(PublicKey: String): AccountBalance!
    peers: [Peers!]
    mapPeers: [MapPeers!]
=======
    blocks(ChainType: Int, Limit: Int, Height: Int): Blocks
    block(ChainType: Int, ID: ID, Height: Int): Block!
    transactions(Limit: Int, Offset: Int): [Transactions!]
    transaction(ID: ID): Transactions!
>>>>>>> 696e51c5ff803d69e30b88d64a9eebbf55dfdf89
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
    SenderPublicKey: String
    RecipientPublicKey: String
    AmountNQT: String
    FeeNQT: String
    EcBlockHeight: Int
    EcBlockID: String
    Version: String
    Timestamp: String
    Signature: String
    Type: String
    Height: Int
    Hash: String
  }
`;
