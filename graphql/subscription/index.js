const { PubSub } = require('apollo-server');

const pubsub = new PubSub();
const events = {
  blocks: 'blocks',
};

module.exports = { pubsub, events };
