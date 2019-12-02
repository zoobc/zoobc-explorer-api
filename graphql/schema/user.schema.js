const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(email: String!, password: String!, role: String): Token!
    signIn(email: String!, password: String!): Token!
    updateUser(status: String!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    user: User!
    token_expired: Date!
    token_access: String!
  }

  type User {
    id: ID!
    email: String!
    role: String
    status: String
  }
`;
