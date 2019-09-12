const express = require('express');
const { blockController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  blockController.getAll(req, res);
});

router.get('/:id', (req, res) => {
  blockController.getOne(req, res);
});

module.exports = router;
