const express = require('express')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const ejs = require('ejs')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo') // INITIATING MONGOSTORE
const morgan = require('morgan')
const path = require('path')
const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const authController = require('./controllers/user')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')
app.use(express.urlencoded({ extended: false }))

app.use(
  expressSession({
    secret: 'process.env.SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)
app.use(passUserToView)

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/Ads`)
  } else {
    res.render('index.ejs')
  }
})

app.use('/Auth', authController)
app.use(isSignedIn)

app.listen(PORT, () => {
  console.log(`Hello from ${PORT} Port`)
})
