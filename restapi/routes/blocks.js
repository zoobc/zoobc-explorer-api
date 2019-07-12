const express = require('express');
const { blockController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  blockController.get(req, res);
});

router.get('/graph/period', (req, res) => {
  blockController.graphPeriod(req, res);
});

router.get('/graph/summary', (req, res) => {
  blockController.graphSummary(req, res);
});

module.exports = router;
