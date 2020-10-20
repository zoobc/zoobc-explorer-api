const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    nodes(
      page: Int
      limit: Int
      order: String
      AccountAddress: String
      RegistrationStatus: Int
      refresh: Boolean
    ): Nodes!
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
    NodePublicKeyFormatted: String
    OwnerAddress: String
    RegisteredBlockHeight: Int
    LockedFunds: String
    RegistrationStatus: Int
    Latest: Boolean
    Height: Int
    ParticipationScore: String
    BlocksFunds: Int
    RewardsPaid: Float
    RewardsPaidConversion: String
    NodeAddressInfo: NodeAddressInfo
    RegistrationTime: Date
    PercentageScore: Float
  }
`
