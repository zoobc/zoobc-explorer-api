const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    blockReceipts(page: Int, limit: Int, order: String, BlockID: String): BlockReceipts!
  }

  type BlockReceipts {
    BlockReceipts: [BlockReceipt!]!
    Paginate: Paginate!
  }

  type BlockReceipt {
    _id: ID!
    BlockID: String
    Height: Int
    SenderPublicKey: String
    ReceiverPublicKey: String
    DataType: String
    DataHash: String
    ReceiptMerkleRoot: String
    ReceiverSignature: String
    ReferenceBlockHash: String
  }
`;
