require('dotenv').config()
const cors = require('cors')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routing
const router = require('./routes/api')
app.use('/assets', express.static(path.join(__dirname, '/assets')))
app.use('/api', router)

app.get('/test', (req, res) => {
  const response = [
    {
      name: 'Lorem',
    },
    {
      name: 'Ipsum',
    }
  ]
  res.send(response)
})

app.post('/test', (req, res) => {
  const body = req.body
  console.log(body)
  return res.send({ code: 200, body })
})

app.listen(PORT, () => console.log(`Listen at port ${PORT}`))