#!/usr/bin/env node
const express = require('express')

const config = require('./config/config')
const app = express().set('port', config.app.port)

require('./modules/cors')(app)
require('./modules/compression')(app)
require('./modules/log')(app)
require('./modules/swagger')(app)
require('./modules/graphqlsubscription')()
require('./modules/redis')()
require('./modules/mongoose')()
require('./api/routes')(app)

module.exports = app
