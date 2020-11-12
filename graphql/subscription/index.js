const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

const events = {
  blocks: 'blocks',
  transactions: 'transactions',
  nodes: 'nodes',
}

module.exports = { pubsub, events }
