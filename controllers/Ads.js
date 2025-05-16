const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

//:get:index
router.get('/', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  res.render('Ads/index.ejs', { Ads: currentUser.Ads })
})

//:get:new
router.get('/new', async (req, res) => {
  res.render('Ads/new.ejs')
})

//:get:Create
router.post('/', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  currentUser.Ads.push(req.body)
  await currentUser.save()
  req.redirect(`/users/${currentUser._id}/Ads`)
})

module.exports = router
