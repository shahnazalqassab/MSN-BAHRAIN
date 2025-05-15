const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

//signin
router.get('/signIn', (req, res) => {
  res.render('Auth/signIn.ejs')
})

router.post('/signIn', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.send('Invalid credentials')
    }

    req.session.user = { _id: user._id, username: user.username }
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.redirect('/Auth/signIn')
  }
})

//signUp router

router.get('/signUp', (req, res) => {
  res.render('Auth/signUp.ejs')
})

router.post('/signUp', async (req, res) => {
  const userExists = await User.findOne({ username: req.body.username })
  if (userExists) {
    return res.send('Username already taken')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Passwords do not match')
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  const user = await User.create(req.body)

  req.session.user = {
    username: user.username,
    _id: user._id
  }

  req.session.save(() => {
    res.redirect('/')
  })
})

router.get('/signUp', (req, res) => {
  res.render('Auth/signUp.ejs')
})

router.get('/signIn', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })

  if (!userInDatabase) {
    return res.send('Login failed. Please try again later.')
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Login failed. Please try again later.')
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  req.session.save(() => {
    res.redirect('/')
  })
})

router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
