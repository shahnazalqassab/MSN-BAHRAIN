const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); // LOOKING UP THE CURRENT USER
    // console.log(currentUser.applications);
    res.render('auth/index.ejs', {
        applications: currentUser.applications,
    }); // RENDERING THE PAGE WITH HIS DETAILS

} catch (error) {
    console.log(error);
    res.redirect('/');
}
});

module.exports = router;
