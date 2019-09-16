const saslprep = require('saslprep');
const mongoose = require('mongoose');

const config = require('../config/config');
const { msg } = require('../utils');

module.exports = () => {
  const uris = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;
  mongoose.connect(uris, {
    user: config.db.username,
    pass: saslprep(config.db.password),
    // autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once('open', () => {
      msg.green('🚀', 'MongoDB connection success');
    })
    .on('error', error => {
      msg.red('❌', `MongoDB connection error.\n${error}`);
    });
};
