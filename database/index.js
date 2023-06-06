const { Pool } = require('pg')

const database = new Pool({
  user: 'fjnjfnyb',
  host: 'satao.db.elephantsql.com',
  database: 'fjnjfnyb',
  password: 'vJTa64jbYes7Zt-OOk47peppkOlR65_n',
  port: 5432,
})

module.exports = database
