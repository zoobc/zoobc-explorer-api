# zoobc-explorer-api

middleware explorer API for zoobc. Built with Node.js, express.

## Top-Level Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Redis](https://redis.io/topics/quickstart)
- [SSL Certificate](https://support.microfocus.com/kb/doc.php?id=7013103)

## Application Needed

- Redis
    - [How to Install on Windows 10](https://redislabs.com/blog/redis-on-windows-10/)
    - [How to Install on MaxOS or Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)
- Nodemon
    - [How to Install](https://github.com/remy/nodemon#nodemon)

## How to Usage

clone the Explorer API repository then create your branch from ```develop``` on terminal.

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
    ├── config                # Configuration database oracle dan doc api
    └── main                  # Helper files for App.js

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details