const express = require('express')
const { searchController } = require('../controllers')

const router = express.Router()

router.get('/', (req, res) => {
  searchController.SearchIdHash(req, res)
})

module.exports = router
