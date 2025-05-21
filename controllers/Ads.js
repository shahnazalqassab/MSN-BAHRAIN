const express = require('express')
const User = require('../models/users.js')
const multer = require('multer')

const router = express.Router()

//add pic
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'public/Ads/') // the folder to save
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + '-' + file.originalname)
  }
})

//storage
const upload = multer({ storage })

//get:index
router.get('/:userId/Ads', async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)
  const Ads = currentUser.Ads
  res.render('Ads/index.ejs', { Ads, user: currentUser })
})

//:get:new
router.get('/:userId/new', async (req, res) => {
  const currentUser = await User.findById(req.params.userId)

  res.render('Ads/new.ejs', { user: currentUser })
})

//:get:Create
router.post('/:userId/Ads', upload.single('img'), async (req, res) => {
  const currentUser = await User.findById(req.session.user._id)

  const picPath = req.file.filename

  console.log(picPath)

  const info = {
    img: picPath,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category
  }
  console.log(info)
  currentUser.Ads.push(info)
  await currentUser.save()
  res.redirect(`/Ads/${currentUser._id}/Ads`)
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
  currentUser.Ads.id(req.params.adId).deleteOne()
  await currentUser.save()
  res.redirect(`/Ads/${currentUser._id}/Ads`)
})

//category
router.get('/', async (req, res) => {
  const Ads = Ads.id(req.params.adId)
  if (Ads.category === 'books') {
    res.redirect(`/Ads/categories/book`)
  } else if (Ads.category === 'phones') {
    res.redirect('/Ads/categories/phone')
  } else if (Ads.category === 'laptop') {
    res.redirect('/Ads/categories/laptop')
  } else if (Ads.category === 'cars') {
    res.redirect('/Ads/categories/cars')
  } else if (Ads.category === 'spare parts') {
    res.redirect('/Ads/categories/spareParts')
  }
})
module.exports = router
