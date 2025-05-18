const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

// SIGN IN PAGE CALL
router.get('/signIn', (req, res) => {
  res.render('user/signIn.ejs')
});


// SIGN IN ROUTE
router.post('/signIn', async (req, res) => {
  // res.send('new user sign in') JUST A TESTING CODE
      const userInDatabase = await User.findOne({ username: req.body.username });     // getting the user from the db
      // res.send(userInDatabase.username);
      if (!userInDatabase) {
        return res.send("User doesn't exist. Please try again.");
      }

      const validPassword = bcrypt.compareSync(  // user exist, testing password
        req.body.password,
        userInDatabase.password
    );
      if (!validPassword) {
      return res.send("Wrong Password. Please try again.");
      }

    req.session.user = {
      username: userInDatabase.username, 
      _id: userInDatabase._id
    };
       console.log("Request to sign in received!");
    req.session.save(() => {
    res.redirect("/");
    })
    
})


// SIGN UP PAGE CALL
router.get('/signUp', (req, res) => {
  res.render('user/signUp.ejs')
});


// SIGN UP ROUTE  
router.post('/signUp', async (req, res) => {
  const userExists = await User.findOne({ username: req.body.username })
  if (userExists) {
    return res.send('Username already taken')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Passwords do not match')
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword

  const user = await User.create(req.body)

  req.session.user = {
    username: user.username,
    _id: user._id
  }

  req.session.save(() => {
    res.redirect('/')
  })
})


// SIGN OUT ROUTE
router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


router.get('/:userId/user', async (req, res) => {
  res.render('user/index.ejs');  
})


module.exports = router;