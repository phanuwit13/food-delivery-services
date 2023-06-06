const express = require('express')
const route = express.Router()
const addonsControl = require('../controllers/addons')

route.post(
  '/add-addons',
  async (req, res, next) => {
    addonsControl.addAddons(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)
route.get(
  '/get-addons',
  async (req, res, next) => {
    addonsControl.getAddAddonsByStore(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)


module.exports = route
