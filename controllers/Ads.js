const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

//:get:index
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); // LOOKING UP THE CURRENT USER
    // console.log(currentUser.applications);
    res.render('user/index.ejs', {
        applications: currentUser.applications,
    }); // RENDERING THE PAGE WITH HIS DETAILS

} catch (error) {
    console.log(error);
    res.redirect('/');
}
});

//:get:new
router.get('/new', async (req, res) => {
  res.render('Ads/new.ejs')
})

//:get:Create
router.post('/Ads', async (req, res) => {
  // const currentUser = await User.findById(req.session.user._id)
  // currentUser.Ads.push(req.body)
  // await currentUser.save()
  // res.redirect(`/users/${currentUser._id}/Ads`)
  await User.create(req.body)
  res.redirect('/Ads/new')
})



// ...existing code...


router.get('/:adId/edit', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const ad = user.Ads.id(req.params.adId);
  res.render('Ads/edit.ejs', { user, ad });
});

// Update Ad
router.put('/:adId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const ad = user.Ads.id(req.params.adId);
  ad.title = req.body.title;
  ad.price = req.body.price;
  ad.description = req.body.description;
  ad.category = req.body.category;
  await user.save();
  res.redirect('/Ads');
});

// Delete Ad
router.delete('/:adId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  user.Ads.id(req.params.adId).remove();
  await user.save();
  res.redirect('/Ads');
});

// // ...existing code...










module.exports = router