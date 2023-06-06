const express = require('express')
const route = express.Router()
const branchControl = require('../controllers/branch')

route.post(
  '/branch-type',
  async (req, res, next) => {
    branchControl.addBranchType(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

route.get(
  '/branch-type',
  async (req, res, next) => {
    branchControl.getBranchType(req, res, next)
  },
  function (req, res) {
    const response = res.data
    res.status(200).json(response)
  }
)

// route.post(
//   '/branch-type',
//   async (req, res, next) => {
//     branch_control.getBranchType(req, res, next)
//   },
//   function (req, res) {
//     var response = res.data
//     res.status(200).json(response)
//   }
// )

module.exports = route
