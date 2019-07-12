const express = require('express');
const { transactionController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  transactionController.get(req, res);
});

router.get('/graph/amounts', (req, res) => {
  transactionController.transStat(req, res);
});

router.get('/graph/type', (req, res) => {
  transactionController.graph(req, res);
});

module.exports = router;
