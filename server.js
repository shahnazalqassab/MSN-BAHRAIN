const express = require('express')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const ejs = require('ejs')

const app = express()

const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require('morgan')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo') // INITIATING MONGOSTORE
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

const authController = require('./controllers/user')
const adsController = require('./controllers/Ads')

const PORT = process.env.PORT ? process.env.PORT : "3000"
const path = require('path')


///// THE USE SECTION //////

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"));
app.use(morgan('dev'));


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
  // req.session.destroy();
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/Ads`)
  } else {
    res.render('index.ejs')
  }
})

app.use('/auth', authController)

app.use('/Ads', adsController)
app.use(isSignedIn)


app.listen(PORT, () => {
  console.log(`Hello from ${PORT} Port`)
})
