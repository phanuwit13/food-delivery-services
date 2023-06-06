const express = require('express')
const app = express()
const api = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const formData = require('express-form-data')
const PORT = process.env.PORT || 4020

app.use(formData.parse())

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', api)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
