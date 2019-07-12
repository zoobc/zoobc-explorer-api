const express = require('express');
const { accountBalancesController } = require('../controllers');

const router = express.Router();

router.get('/:id', (req, res) => {
  accountBalancesController.find(req, res);
});

router.get('/', (req, res) => {
  accountBalancesController.get(req, res);
});

module.exports = router;
