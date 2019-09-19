const express = require('express');
const { AccountController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  AccountController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  AccountController.getOne(req, res);
});

module.exports = router;
