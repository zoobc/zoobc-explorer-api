const express = require('express');
const { peersController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  peersController.get(req, res);
});

router.get('/map', (req, res) => {
  peersController.getMap(req, res);
});

module.exports = router;
