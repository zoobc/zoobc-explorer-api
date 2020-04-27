const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

const events = {
  blocks: 'blocks',
  transactions: 'transactions',
};

module.exports = { pubsub, events };
