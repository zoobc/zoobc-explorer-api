const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    search(Id: String!): SearchResult
  }

  type SearchResult {
    ID: String
    Height: Int
    Timestamp: Date
    FoundIn: String
  }
`;
