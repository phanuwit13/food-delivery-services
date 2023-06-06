const express = require('express')
const route = express.Router()
const foodControl = require('../controllers/food')

route.get(
  '/get-food',
  async (req, res, next) => {
    foodControl.getFoodByStore(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

route.post(
  '/add-food-type',
  async (req, res, next) => {
    foodControl.addFoodType(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

route.get(
  '/get-food-type',
  async (req, res, next) => {
    foodControl.getFoodTypeByStore(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

route.post(
  '/add-food',
  async (req, res, next) => {
    foodControl.addFood(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)
route.get(
  '/get-food-addons',
  async (req, res, next) => {
    foodControl.getFoodAddons(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

module.exports = route
