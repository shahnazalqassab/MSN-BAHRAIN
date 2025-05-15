const router = require('express').Router()

const Ads = require('../models/users')

router.get('/', async (req, res) => {
  const ads = await Ads.find().findById(req.session.user._id)

  res.render('')
})
