module.exports = {
  "apps" : [
    {
      "name": "zoobc-testnet:1680",
      "script": "app.js",
      "autorestart": "true",
      "watch": "false",
      "env": {
        "COMMON_VARIABLE": "true"
      },
      "env_production": {
        "PORT": "9696",
        "DB_HOST": "localhost",
        "DB_NAME": "explorerdb",
        "DB_USER": "",
        "DB_PASSWORD": "",
        "RD_HOST": "localhost",
        "RD_PASSWORD": "",
        "PROTO_HOST": "172.104.47.168",
        "PROTO_PORT": "8000",
      }
    }
  ],
  "deploy" : {
    "testnet" : {
      "user" : "node",
      "host" : "localhost",
      "ref"  : "origin/testnet",
      "repo" : "git@github.com:zoobc/zoobc-explorer-api.git",
      "path" : "/Users/blockchainzoo/Documents/zoobc/zoobc-explorer-api",
      "ssh_options": "StrictHostKeyChecking=no",
      "post-deploy" : "npm install && pm2 reload ecosystem.config.js --env testnet"
    }
  }
};
