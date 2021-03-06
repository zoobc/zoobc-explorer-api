![ZooBC-explorer-api](https://user-images.githubusercontent.com/32409305/64093919-9f1b6900-cd8c-11e9-97a6-24385550a53c.png)

# ZooBC Explorer API

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CircleCI](https://circleci.com/gh/zoobc/zoobc-explorer-api/tree/master.svg?style=svg&circle-token=b4cabe3402e1055f17201d64f1dd47bfc0dcb3a2)](https://circleci.com/gh/zoobc/zoobc-explorer-api/tree/master)


A web viewer for searching and displaying data published by the explorer server web API, so that a user can easily find any info about the blockchain. Data should include: blocks, transactions, accounts, peers, statistical information. Should have a modular design to make it easy for other companies to extend the explorer UI with screens for their specific use cases. It should be a web application with a browser DB to sort and find data locally.

## Top-Level Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Redis](https://redis.io/topics/quickstart)
- [Rest API](https://restfulapi.net/)
- [GraphQL](https://graphql.org/code/#javascript)
- [Apollo-Graphql](https://www.apollographql.com/docs/)
- [SSL Certificate](https://support.microfocus.com/kb/doc.php?id=7013103)
- [Swagger](https://swagger.io/)
- [MongoDB](https://www.mongodb.com/)

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

## How to Update Models

```bash
$ ./models.sh
# delete and clone repository zoobc-explorer-scheduler
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
    ├── api                   # Directory for RestAPI Services
    ├   ├── controllers       # Containing class files for the controllers
    ├   ├── routes            # Containing routes API
    ├   └── services          # Containing class files for the service controllers
    ├── config                # Configuration application, graphql and doc api
    ├── docs                  # The screnshoot, doc api and json format import insomnia
    ├── graphql               # Directory a query language for API
    ├   ├── resolvers          # Containing files for the resolver
    ├   └── schema            # Schema models
    ├── html                  # Base template to generate api documentation tools using swagger
    ├── logs                  # Log files
    ├── models                # Structure of tables and properties
    ├── server                # Configuration base files for RestAPI and GraphQL
    └── utils                 # Functions that are provided application

## License

See the [LICENSE](LICENSE) file for details
