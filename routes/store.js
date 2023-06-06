const express = require('express')
const route = express.Router()
const storeControl = require('../controllers/store')

route.post(
  '/add-store',
  async (req, res, next) => {
    storeControl.addStore(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)
route.get(
  '/list-store',
  async (req, res, next) => {
    storeControl.getStoreList(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)


module.exports = route
