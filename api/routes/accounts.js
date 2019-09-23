const express = require('express');
const { accountController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  accountController.getAll(req, res);
});

router.get('/:accountAddress', (req, res) => {
  accountController.getOne(req, res);
});

module.exports = router;
