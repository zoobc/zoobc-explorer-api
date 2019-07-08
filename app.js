require('dotenv').config();
const express = require('express');
const app = express();

require('./main/redis')();
require('./main/cors')(app);
require('./main/server')(app);
require('./main/log')(app);
require('./main/swagger')(app);

module.exports = app;
