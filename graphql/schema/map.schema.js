const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    maps(CountryCode: String, RegistryStatus: Int): [Maps!]!
  }

  type Maps {
    _id: ID!
    NodeID: String
    NodePublicKey: String
    OwnerAddress: String
    NodeAddress: NodeAddress
    RegistryStatus: Int
    CountryCode: String
    CountryName: String
    RegionCode: String
    RegionName: String
    City: String
    Latitude: Float
    Longitude: Float
    CountryFlagUrl: String
    CountryFlagEmoji: String
  }
`
