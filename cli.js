const { UsersService } = require('./api/services/index');
const _ = require('lodash');
const service = new UsersService();

require('./config/config');
require('./server/mongoose')();

let Value = process.argv.slice(2);
let command = Value[0];
let username = '';

let password = '';

if (command === 'zoobc') {
  if (Value[1] == 'login') {
    (async () => {
      //===============================================================================================================
      if (Value.length != 6) {
        console.log('need more parameter');
        process.exit(0);
      }

      if (Value[2] === '-u') {
        username = Value[3];
      } else if (Value[2] === '-p') {
        password = Value[3];
      } else {
        console.log(Value[2], 'is invalid command');
        process.exit(0);
      }

      if (Value[4] === '-u') {
        username = Value[5];
      } else if (Value[4] === '-p') {
        password = Value[5];
      } else {
        console.log(Value[4], 'is invalid command');
        process.exit(0);
      }
      //===============================================================================================================
      try {
        const result = await service.signIn(username, password);
        if (result) {
          console.log('HASH = ', result.data.token);
        } else {
          console.log('signin failed. ');
        }
      } catch (error) {
        console.error('signin error : ', error);
      }
      process.exit(0);
    })();
    //===============================================================================================================
  } else if (Value[1] == 'reset') {
    if (Value.length != 3) {
      console.log('need more parameter');
      process.exit(0);
    }

    (async () => {
      const token = Value[2];
      try {
        if (token) {
          const service = new UsersService();
          const result = await service.resetDB(token);
          console.log(result);

          if (result) {
            console.log('reset db succeed.');
          } else {
            console.log('reset db failed.');
          }
        }
      } catch (error) {
        console.error('reset db error : ', error);
      }
      console.log('DB RESETED');
      process.exit(0);
    })();
  } else {
    console.log('Invalid Command, please use -h for help');
    process.exit(0);
  }
} else {
  console.log('invalid input');
}
