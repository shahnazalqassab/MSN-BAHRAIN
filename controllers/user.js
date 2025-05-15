const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

// SIGN OUT
router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
// SIGN IN ROUTE
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
    res.redirect('/auth/signIn')
  }
})

// SIGN IN PAGE CALL
router.get('/signIn', (req, res) => {
  res.render('/auth/signIn.ejs')
})


// SIGN UP ROUTE
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
    res.redirect('/auth/index.ejs')
  })
});

// SIGN UP PAGE CALL
router.get('/signUp', (req, res) => {
  res.render('/auth/signUp.ejs')
});

module.exports = router;
