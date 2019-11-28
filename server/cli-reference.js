// FOR REFERENCE ONLY
// KEVIN WILL ENHANCE THIS FILE
// SUKSEMA

const _ = require('lodash');
const yargs = require('yargs');
const storage = require('node-persist');
const { UsersService } = require('../api/services/index');

const usernameOptions = {
  describe: 'Username',
  demand: true,
  alias: 'u',
};

const passwordOptions = {
  describe: 'Password',
  demand: true,
  alias: 'p',
};

const argv = yargs
  .command('signin', 'SignIn to app', {
    username: usernameOptions,
    password: passwordOptions,
  })
  .command('resetDB', 'Reset MongoDB')
  .help().argv;

const command = argv._[0];

if (command === 'signin') {
  (async () => {
    const service = new UsersService();
    try {
      const result = await service.signIn(argv.username, argv.password);
      if (result) {
        console.log('signin succeed. ');
        try {
          await storage.init();
          const setToken = await storage.setItem('token', result.data.token);
          if (setToken) {
            //const token = await storage.getItem('token');
            console.log('set token succeed. ');
          } else {
            console.log('set token failed. ');
          }
        } catch (error) {
          console.error('set token error : ', error);
        }
      } else {
        console.log('signin failed. ');
      }
    } catch (error) {
      console.error('signin error : ', error);
    }
    process.exit(0);
  })();
} else if (command === 'resetDB') {
  (async () => {
    try {
      await storage.init();
      const token = await storage.getItem('token');
      if (token) {
        const service = new UsersService();
        const result = await service.resetDB(token);
        if (result) {
          console.log('reset db succeed.');
        } else {
          console.log('reset db failed.');
        }
      }
    } catch (error) {
      console.error('reset db error : ', error);
    }
    process.exit(0);
  })();
} else {
  console.log('command not recognized');
}

module.exports = argv;
