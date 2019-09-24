const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    nodes(page: Int, limit: Int, order: String): Nodes!
    node(NodeID: ID!): Node!
  }

  type Nodes {
    Nodes: [Node!]!
    Paginate: Paginate!
  }

  type Node {
    _id: ID!
    NodePublicKey: String
    OwnerAddress: String
    NodeAddress: String
    LockedFunds: String
    RegisteredBlockHeight: Int
    ParticipationScore: Int
    RegistryStatus: Boolean
    BlocksFunds: Int
    RewardsPaid: Int
    Latest: Boolean
    Height: Int
    NodeID: String
  }
`;
