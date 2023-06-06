const express = require('express')
const route = express.Router()
const groupSelectControl = require('../controllers/groupSelect')

route.post(
  '/add-group-select',
  async (req, res, next) => {
    groupSelectControl.addGroupSelect(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)
route.get(
  '/get-group-select',
  async (req, res, next) => {
    groupSelectControl.getGroupSelect(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

module.exports = route
