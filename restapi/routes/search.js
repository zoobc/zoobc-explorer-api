const express = require('express');
const { searchController } = require('../controllers');

const router = express.Router();

router.get('/:id', (req, res) => {
  searchController.SearchIdHash(req, res);
});

module.exports = router;
