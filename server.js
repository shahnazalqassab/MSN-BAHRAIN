const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('HELLO')
})
const PORT = 2000
app.listen(PORT, () => {
  console.log(`Hello from ${PORT} Post`)
})
