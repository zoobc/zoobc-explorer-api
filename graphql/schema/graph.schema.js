const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    transactionGraph: [TransactionGraph!]!
    blockGraph: [BlockGraph!]!
  }

  type TransactionGraph {
    name: String
    amt: Int
  }

  type BlockGraph {
    name: String
    amt: Int
  }
`;
