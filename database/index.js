const { Pool } = require('pg')

const database = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

module.exports = database
