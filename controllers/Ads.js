const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

//:get:new
router.get('/:userId/new', async (req, res) => {
  const currentUser = await User.findById(req.params.userId)
  res.render('Ads/new.ejs', { user: currentUser })
})

//:get:Create
router.post('/:userId/Ads', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const { title, price, description, category } = req.body

  const imagePath = req.file ? req.file.path : null

  const newAd = {
    title,
    price,
    description,
    category,
    img: imagePath // Store file path in the schema
  }
  currentUser.Ads.push(newAd)
  await currentUser.save()
  res.redirect(`/Ads/${currentUser._id}/Ads`)
})

//get:index
router.get('/:userId/Ads', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const Ads = currentUser.Ads
  res.render('Ads/index.ejs', { Ads })
})

//get:show
router.get('/:userId/Ads/:AdsId', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const ads = currentUser.Ads.id(req.params.AdsId)
  res.render('Ads/show.ejs', { ad: ads })
})

//get:edit
router.get('/:userId/Ads/:adId/edit', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const Ad = currentUser.Ads.id(req.params.adId)
  res.render('Ads/edit.ejs', { currentUser, Ad })
})

// Update Ad
router.put('/:userId/Ads/:adId', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const ad = currentUser.Ads.id(req.params.adId)
  ad.set(req.body)
  await currentUser.save()
  res.redirect(`/Ads/${currentUser._id}/Ads/${req.params.adId}`)
})

// Delete Ad
router.delete('/:userId/Ads/:adId', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  currentUser.Ads.id(req.params.adId).remove()
  await currentUser.save()
  res.redirect(`/Ads/${currentUser._id}/Ads`)
})

module.exports = router
