const express = require('express')
const { nodeController } = require('../controllers')

const router = express.Router()

router.get('/', (req, res) => {
  nodeController.getAll(req, res)
})

router.get('/:nodeID', (req, res) => {
  nodeController.getOne(req, res)
})

module.exports = router
