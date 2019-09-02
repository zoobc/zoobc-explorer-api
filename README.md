![ZooBC-explorer-api](https://user-images.githubusercontent.com/32409305/64093919-9f1b6900-cd8c-11e9-97a6-24385550a53c.png)

# ZooBC Explorer API

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A web viewer for searching and displaying data published by the explorer server web API, so that a user can easily find any info about the blockchain. Data should include: blocks, transactions, accounts, peers, statistical information. Should have a modular design to make it easy for other companies to extend the explorer UI with screens for their specific use cases. It should be a web application with a browser DB to sort and find data locally.

## Top-Level Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Redis](https://redis.io/topics/quickstart)
- [gRPC](https://grpc.io/docs/quickstart/node/)
- [Rest API](https://restfulapi.net/)
- [GraphQL](https://graphql.org/code/#javascript)
- [Apollo-Graphql](https://www.apollographql.com/docs/)
- [IP Location](https://www.npmjs.com/package/iplocation)
- [SSL Certificate](https://support.microfocus.com/kb/doc.php?id=7013103)
- [Swagger](https://swagger.io/)

## Application Needed

- Redis
  - [How to Install on Windows 10](https://redislabs.com/blog/redis-on-windows-10/)
  - [How to Install on MaxOS or Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)
- Nodemon
  - [How to Install](https://github.com/remy/nodemon#nodemon)
- GraphQL CLI (optional)
  - [How to Install](https://oss.prisma.io/content/graphql-cli/01-overview)

## How to Usage

Fork and clone the Explorer Middleware repository then create your branch from ```develop``` on terminal.

```bash
$ git clone git@github.com:your-github-account/zoobc-explorer-api.git
# clone the Explorer API from your branch

$ cd zoobc-explorer-api
# change directory zoobc-explorer-api

$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
# create a .pem file for SSL Certificate Installations for https://localhost

$ yarn install or npm install
# install dependencies using yarn or npm

$ yarn start or npm start
# starting app using yarn or npm
```

## How to Update Schema

```bash
$ ./schema.sh
# delete and clone repository zoobc-schema
```

## Usage with CLI

```bash
$ yarn zoobc -h or yarn zoobc --help
# print zoobc command line options

$ yarn zoobc start
# start server api

$ yarn zoobc stop
# stop server api

$ yarn zoobc port
# print port server api
```

## Issue

Sometime getting unknow error when restart app, this is couse port already used. Using this command for kill port

```bash
$ sudo netstat -lpn |grep :6969
# grep port 6969

$ kill xxxx     //listen number
# hard kill listen number
```

## A Typical Top-Level Directory

    .
    ├── ...
    ├── apidoc                # Static HTML for API documentation
    ├── config                # Configuration application, graphql and doc api
    ├── docs                  # The screnshoot, doc api and json format import insomnia
    ├── grapqh                # Directory a query language for API
    ├   ├── resovers          # Containing files for the resolver
    ├   └── schema            # Schema models
    ├── logs                  # Log files
    ├── main                  # Modules files for app.js
    ├── models                # Structure of tables and properties
    ├── restapi               # Directory a rest language for API
    ├   ├── controllers       # Containing class files for the controllers
    ├   ├── routes            # Containing routes API
    ├   └── services          # Containing class files for the service controllers
    └── utils                 # Functions that are provided application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
