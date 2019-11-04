const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    nodes(page: Int, limit: Int, order: String, AccountAddress: String): Nodes!
    node(NodeID: String, NodePublicKey: String): Node!
  }

  type Nodes {
    Nodes: [Node!]!
    Paginate: Paginate!
  }

  type Node {
    _id: ID!
    NodeID: String
    NodePublicKey: String
    OwnerAddress: String
    NodeAddress: String
    LockedFunds: String
    RegisteredBlockHeight: Int
    ParticipationScore: Int
    RegistryStatus: Boolean
    BlocksFunds: Int
    RewardsPaid: Float
    RewardsPaidConversion: String
    Latest: Boolean
    Height: Int
  }
`;
