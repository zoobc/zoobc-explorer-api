const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')

const config = require('./config/config')
const app = express().set('port', config.app.port)

const server =
  !fs.existsSync(config.app.openSslKeyPath) || !fs.existsSync(config.app.openSslCertPath)
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync(config.app.openSslKeyPath),
          cert: fs.readFileSync(config.app.openSslCertPath),
        },
        app
      )

require('./modules/cors')(app)
require('./modules/compression')(app)
require('./modules/log')(app)
require('./modules/swagger')(app)
require('./modules/cluster')(server)
require('./modules/graphql')(app, server)
require('./modules/redis')()
require('./modules/mongoose')()
require('./api/routes')(app)

module.exports = app
