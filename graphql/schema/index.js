const { gql } = require('apollo-server-express');

const blockSchema = require('./block.schema');
const transactionSchema = require('./transaction.schema');
const accountSchema = require('./account.schema');
const searchSchema = require('./search.schema');
const nodeSchema = require('./node.schema');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
  type Paginate {
    Page: Int
    Count: Int
    Total: Int
  }
`;

module.exports = [linkSchema, blockSchema, transactionSchema, accountSchema, searchSchema, nodeSchema];
