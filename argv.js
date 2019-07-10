const argv = process.argv[2];

switch (argv) {
  case 'start':
    require('./main/server').start();
    break;
  case 'stop':
    require('./main/server').stop();
    break;
  case 'port':
    require('./main/server').port();
    break;
  case '--help' || '-h':
    require('./main/help')();
    break;
  default:
    require('./main/help')();
    break;
}
