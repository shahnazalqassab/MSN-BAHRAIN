const express = require('express')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const ejs = require('ejs')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const app = express()

const PORT = process.env.PORT
app.get('/', (req, res) => {
  res.send('HELLO')
})

app.listen(PORT, () => {
  console.log(`Hello from ${PORT} Post`)
})
