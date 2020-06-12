const express = require('express')
const { blockController } = require('../controllers')

const router = express.Router()

router.get('/period', (req, res) => {
  blockController.graphPeriod(req, res)
})

router.get('/summary', (req, res) => {
  blockController.graphSummary(req, res)
})

module.exports = router
