const { gql } = require('apollo-server-express')

const blockSchema = require('./block.schema')
const transactionSchema = require('./transaction.schema')
const accountSchema = require('./account.schema')
const searchSchema = require('./search.schema')
const nodeSchema = require('./node.schema')
const graphSchema = require('./graph.schema')
const mapSchema = require('./map.schema')

const linkSchema = gql`
  scalar Date

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

  type NodeAddress {
    Address: String
    Port: Int
  }
`

module.exports = [
  linkSchema,
  blockSchema,
  transactionSchema,
  accountSchema,
  searchSchema,
  nodeSchema,
  graphSchema,
  mapSchema,
]
