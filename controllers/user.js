const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')
const multer = require('multer')

// // configuraton for the multer storage
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'public/uploads/') // the folder to save
  },
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + '-' + file.originalname)
  }
});

// const upload = multer({destination: 'public/uploads/'});
const upload = multer({ storage })

// SIGN UP PAGE CALL
router.get('/signUp', (req, res) => {
  res.render('user/signUp.ejs')
})

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

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    contactNo: req.body.contactNo,
    email: req.body.email,
    profile: 'uploads/newUser.png'
  }

  const user = await User.create(newUser)

  req.session.user = {
    username: user.username,
    _id: user._id
  }

  req.session.save(() => {
    res.redirect('/')
  })
})

// SIGN IN PAGE CALL
router.get('/signIn', (req, res) => {
  res.render('user/signIn.ejs')
})

// SIGN IN ROUTE
router.post('/signIn', async (req, res) => {
  // res.send('new user sign in') JUST A TESTING CODE
  const userInDatabase = await User.findOne({ username: req.body.username }) // getting the user from the db
  // res.send(userInDatabase.username);
  if (!userInDatabase) {
    return res.send("User doesn't exist. Please try again.")
  }

  const validPassword = bcrypt.compareSync(
    // user exist, testing password
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Wrong Password. Please try again.')
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
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

////////////////////////////// AFTER SIGN IN ROUTES /////////////////////////

// GET /:USERID/USER DASHBOARD
router.get('/:userId/user', async (req, res) => {
  const currentUser = await User.findById(req.session.user)

  res.render('user/index.ejs', { user: currentUser })
})

// GET /:USERID/EDIT (EDIT PROFILE ROUTE)
router.get('/:userId/edit', async (req, res) => {
  const checkVar = 0

  try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('user/edit.ejs', {
      user: currentUser,
      checkVar
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// PUT :USERID/USER (SAVING PROFILE UPDATES ROUTE)
router.put('/:userId/user', async (req, res) => {
  const submit = req.body.submit // Learned this condition from stack overFlow

  const currentUser = await User.findById(req.session.user._id)

  if (submit === 'Update Profile') {
    // updating profile details
    try {
      currentUser.contactNo = req.body.contactNo
      currentUser.email = req.body.email

      await currentUser.save()

      res.redirect(`/user/${currentUser._id}/user`)
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  } else if (submit === 'Change Password') {
    // updating password
    try {
      const validPassword = bcrypt.compareSync(
        req.body.currentPassword,
        currentUser.password
      )

      if (validPassword) {
        if (req.body.newPassword === req.body.confirmPassword) {
          currentUser.password = bcrypt.hashSync(req.body.newPassword, 10)

          await currentUser.save()

          res.redirect(`/user/signOut`)
        } else {
          res.redirect('/')
        }
      } else {
        res.redirect('/')
      }
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
})

// GET :USERID/CHANGEPASSWORD (EDIT PASSWORD ROUTE)
router.get('/:userId/changePassword', async (req, res) => {
  const checkVar = 1

  try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('user/edit.ejs', {
      password: currentUser.password,
      checkVar
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:userId/changePic', async (req, res) => {
  const checkVar = 2

  try {
    const currentUser = await User.findById(req.session.user._id)
    console.log(currentUser)

    res.render('user/edit.ejs', {
      currentUser,
      checkVar
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// router.post('/:userId/changePic', async (req, res) => {
// const currentUser = await User.findById(req.session._id);

//   console.log(req.file);
//   res.send('correct so far')
// });

router.post('/:userId/changePic', upload.single('profile'), async (req, res) => {
  try{
    const picPath = req.file.filename;

    const currentUser = await User.findById(req.session.user._id);
    currentUser.profile = picPath

    await currentUser.save()

  res.redirect(`/user/${currentUser._id}/user`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
  // console.log(req.file);
})

module.exports = router
