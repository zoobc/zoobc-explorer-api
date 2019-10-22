const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    publishedReceipts(page: Int, limit: Int, order: String, BlockHeight: Int): PublishedReceipts!
  }

  type PublishedReceipts {
    PublishedReceipts: [PublishedReceipt!]!
    Paginate: Paginate!
  }

  type BatchReceipt {
    SenderPublicKey: String
    ReceiverPublicKey: String
    DataType: String
    DataHash: String
    Height: Int
    ReferenceBlockHash: String
    ReceiptMerkleRoot: String
    ReceiverSignature: String
  }

  type PublishedReceipt {
    _id: ID!
    BatchReceipt: BatchReceipt!
    IntermediateHashes: String
    BlockHeight: Int
    ReceiptIndex: Int
    PublishedIndex: Int
  }
`;
