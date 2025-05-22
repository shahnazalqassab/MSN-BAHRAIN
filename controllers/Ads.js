const express = require('express')
const User = require('../models/users.js')
const multer = require('multer')
const Ads = require('../models/ads.js')

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
  const myAds = await Ads.find().populate('owner')

  res.render('Ads/index.ejs', { myAds, user: currentUser })
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

  const info = {
    img: picPath,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    condition: req.body.condition,
    category: req.body.category,
    owner: req.session.user._id
  }
  console.log(info)
  await Ads.create(info)
  res.redirect(`/Ads/${currentUser._id}/Ads`)
})

//get:show
router.get('/:userId/Ads/:adId', async (req, res) => {
  const selectedAd = await Ads.findById(req.params.adId).populate('owner')
  console.log(req.body)
  res.render('Ads/show.ejs', { ad: selectedAd })
})

//get:edit
router.get('/:userId/Ads/:adId/edit', async (req, res) => {
  const selectedAd = await Ads.findById(req.params.adId)
  res.render('Ads/edit.ejs', { Ad: selectedAd })
})

// Update Ad
router.put('/:userId/Ads/:adId', async (req, res) => {
  try {
    const editedAd = await Ads.findById(req.params.adId)

    if (editedAd.owner.equals(req.session.user._id)) {
      await editedAd.updateOne(req.body)
      res.redirect(`/Ads/${req.session.user._id}/Ads/${req.params.adId}`)
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// Delete Ad
router.delete('/:userId/Ads/:adId', async (req, res) => {
  try {
    const selectedAd = await Ads.findById(req.params.adId)

    if (selectedAd.owner.equals(req.session.user._id)) {
      await selectedAd.deleteOne()
      res.redirect(`/Ads/${req.session.user._id}/Ads`)
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

//category
router.get('/categories', async (req, res) => {
  const selectedCategory = req.query.category

  const allAds = await Ads.find({}).populate('owner')

  const filteredAds = allAds.filter((ad) => ad.category === selectedCategory)

  //.populate('owner')
  if (selectedCategory === 'phones') {
    res.render('categories/phone', { ads: filteredAds })
  } else if (selectedCategory === 'cars') {
    res.render('categories/car', { ads: filteredAds })
  } else if (selectedCategory === 'books') {
    res.render('categories/book', { ads: filteredAds })
  } else if (selectedCategory === 'laptop') {
    res.render('categories/laptop', { ads: filteredAds })
  } else if (selectedCategory === 'Spare Parts') {
    res.render('categories/spareParts', { ads: filteredAds })
  }
})

module.exports = router
