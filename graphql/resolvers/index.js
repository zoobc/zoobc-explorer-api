const { GraphQLDateTime } = require('graphql-iso-date')
const blockResolvers = require('./block.resolvers')
const transactionResolvers = require('./transaction.resolvers')
const accountResolvers = require('./account.resolvers')
const searchResolvers = require('./search.resolvers')
const nodeResolvers = require('./node.resolvers')
const graphResolvers = require('./graph.resolvers')
const mapResolvers = require('./map.resolvers')

const customScalarResolver = {
  Date: GraphQLDateTime,
}

module.exports = [
  customScalarResolver,
  blockResolvers,
  transactionResolvers,
  accountResolvers,
  searchResolvers,
  nodeResolvers,
  graphResolvers,
  mapResolvers,
]
