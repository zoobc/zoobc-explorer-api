let Value = process.argv.slice(2);
let command = Value[0];
let Username = '';
let Password = '';

if (Value.length != 5) {
  console.log('need more parameter');
  return;
}

switch (command) {
  case 'zoobc':
    if (Value[1] === '-u') {
      Username = Value[2];
    } else if (Value[1] === '-p') {
      Password = Value[2];
    } else {
      console.log(Value[1], 'is invalid command');
      break;
    }

    if (Value[3] === '-u') {
      Username = Value[4];
    } else if (Value[3] === '-p') {
      Password = Value[4];
    } else {
      console.log(Value[3], 'is invalid command');
      break;
    }

    console.log('Username = ', Username);
    console.log('Password = ', Password);
    break;
  default:
    console.log('invalid input');
}
