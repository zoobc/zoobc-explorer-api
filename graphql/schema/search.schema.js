const { gql } = require('apollo-server-express');

module.exports = gql`

  extend type Query {
    search(Id: ID!): SearchResult
  }

  type SearchResult{
    ID: String
    Height: Int
    Timestamp: String
    FoundIn: String
  }

`;
