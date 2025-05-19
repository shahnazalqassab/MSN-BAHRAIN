const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

//:get:index
// router.get('/', async (req, res) => {
//   const currentUser = await User.findById(req.session.user._id) // LOOKING UP THE CURRENT USER
//   // console.log(currentUser.applications);
//   res.render('Ads/index.ejs', {
//     Ads: currentUser.user._id
//   }) // RENDERING THE PAGE WITH HIS DETAILS
// })

//:get:new
router.get('/:userId/new', async (req, res) => {
  const currentUser = await User.findById(req.params.userId)
  res.render('Ads/new.ejs', { user: currentUser })
})

//:get:Create
router.post('/:userId/Ads', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  currentUser.Ads.push(req.body)
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
  const Ads = currentUser.Ads.id(req.params.AdsId)
  res.render('Ads/show.ejs', { ad: Ads })
})

//get:edit
router.get('/:userId/Ads/:adId/edit', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const Ads = currentUser.Ads
  res.render('Ads/edit.ejs', { user, Ads })
})

// Update Ad
router.put('/:adId', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const ad = currentUser.Ads.id(req.params.AdsId)
  ad.title = req.body.title
  ad.price = req.body.price
  ad.description = req.body.description
  ad.category = req.body.category
  await user.save()
  res.redirect(`/Ads/${currentUser._id}/Ads`)
})

// Delete Ad
router.delete('/:adId', async (req, res) => {
  const user = await User.findById(req.session.user._id)
  user.Ads.id(req.params.adId).remove()
  await user.save()
  res.redirect('/Ads')
})

// // ...existing code...

module.exports = router
