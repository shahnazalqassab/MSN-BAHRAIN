const router = require('express').Router()

const Ads = require('../models/users')

router.get('/', async (req, res) => {
  const ads = await Ads.find().findById(req.session.user._id)
  res.render('Ads/index.ejs', { Ads: ads.Ads })
})

router.get('/new', async (req, res) => {
  res.render('Ads/new.ejs')
})

router.post('/', async (req, res) => {
  const ads = await Ads.find().findById(req.session.user._id)
  ads.Ads.push(req.body)
  await ads.save()
  res.redirect(`/users/${ads._id}/Ads`)
})
