module.exports = () => {
  console.log(`
  Usage with npm: npm run zoobc [options]
  Usage with yarn: yarn zoobc [options]
  
  Usage with binary file: ./explorer-api-<os platform> [options]
  Example in Mac OS: ./explorer-api-mac --help
  
  Options:
  -h, --help              print zoobc command line options
  port                    print port server api
  start                   start server api
  stop                    stop server api

  Documentation can be found at https://github.com/zoobc/zoobc-explorer-api
  Forum ZooBC at http://forum.zoobc.com
  `)
}