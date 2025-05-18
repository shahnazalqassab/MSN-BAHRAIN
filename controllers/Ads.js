const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

//:get:index
router.get('/', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id) // LOOKING UP THE CURRENT USER
  // console.log(currentUser.applications);
  res.render('Ads/index.ejs', {
    Ads: currentUser.user._id
  }) // RENDERING THE PAGE WITH HIS DETAILS
})

//:get:new
router.get('/:userId/new', async (req, res) => {
  const currentUser = await User.findById(req.params.userId)
  console.log(currentUser)
  res.render('Ads/new.ejs', { user: currentUser })
})

//:get:Create
router.post('/:userId/Ads', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    currentUser.Ads.push(req.body)
    await currentUser.save()
    res.redirect(`/Ads/${currentUser._id}/Ads`)
  } catch (err) {
    console.log(err)
    res.redirect(`/`)
  }
})

router.get('/:userId/Ads', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const Ads = currentUser.Ads
  console.log(Ads)
  res.render('Ads/index.ejs', { Ads })
})

module.exports = router
