const express = require('express')
const food = require('./food')
const branch = require('./branch')
const store = require('./store')
const addons = require('./addons')
const groupSelect = require('./groupSelect')
const route = express.Router()

route.use('/food', food)
route.use('/branch', branch)
route.use('/store', store)
route.use('/addons', addons)
route.use('/group-select', groupSelect)

module.exports = route
