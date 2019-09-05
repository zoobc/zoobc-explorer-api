const express = require('express');
const { SearchController } = require('../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  SearchController.SearchIdHash(req, res);
});

module.exports = router;
