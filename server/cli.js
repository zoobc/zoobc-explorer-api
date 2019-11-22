let Value = process.argv.slice(2);
let command = Value[0];
let Username = '';
let Password = '';

switch (command) {
  case 'zoobc':
    if (Value[1] == 'login') {
      if (Value.length != 6) {
        console.log('need more parameter');
        break;
      }

      if (Value[2] === '-u') {
        Username = Value[4];
      } else if (Value[2] === '-p') {
        Password = Value[4];
      } else {
        console.log(Value[2], 'is invalid command');
        break;
      }

      if (Value[4] === '-u') {
        Username = Value[5];
      } else if (Value[4] === '-p') {
        Password = Value[5];
      } else {
        console.log(Value[4], 'is invalid command');
        break;
      }

      let Hash = (
        Math.random()
          .toString(36)
          .substring(2, 16) +
        Math.random()
          .toString(36)
          .substring(2, 16)
      ).toUpperCase();
      console.log(Hash);
      break;
    } else if (Value[1] == 'reset') {
      if (Value.length != 3) {
        console.log('need more parameter');
        break;
      }

      //CROSS CHECK THE INPUTED HASH WITH THE LATEST HASH IN DB

      console.log('DB RESETED');
      break;
    } else {
      console.log('Invalid Command, please use -h for help');
      break;
    }

  default:
    console.log('invalid input');
}
