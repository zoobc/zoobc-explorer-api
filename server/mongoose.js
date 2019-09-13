const chalk = require('chalk');
const saslprep = require('saslprep');
const mongoose = require('mongoose');

const config = require('../config/config');
const uris = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;

module.exports = () => {
  try {
    mongoose.connect(uris, {
      user: config.db.username,
      pass: saslprep(config.db.password),
      // autoIndex: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection
      .once('open', () => {
        console.log('%s MongoDB connection success', chalk.green('🚀'));
      })
      .on('error', error => {
        console.error('%s MongoDB connection error.\n%s', chalk.red('✗'), error);
      });
  } catch (error) {
    console.error('%s MongoDB connection error.\n%s', chalk.red('✗'), error);
  }
};
