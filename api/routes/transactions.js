const express = require('express');
const { transactionController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  transactionController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  transactionController.getOne(req, res);
});


module.exports = router;
