const express = require('express')
const { transactionController } = require('../controllers')

const router = express.Router()

router.get('/amount', (req, res) => {
  transactionController.graphAmount(req, res)
})

router.get('/type', (req, res) => {
  transactionController.graphType(req, res)
})

module.exports = router
