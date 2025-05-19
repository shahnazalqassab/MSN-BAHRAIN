const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

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

  const newUser = { 
    username: req.body.username,
    password: req.body.password,
    contactNo: req.body.contactNo,
    email: req.body.email,
    img: 'public/images/png-clipart-sticky-notes-sticky-notes-thumbnail.png'
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


// SIGN OUT ROUTE
router.get('/signOut', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

////////////////////////////// AFTER SIGN IN ROUTES /////////////////////////

// GET /:USERID/USER DASHBOARD
router.get('/:userId/user', async (req, res) => {
  const currentUser = await User.findById(req.session.user);
  console.log(currentUser);
  res.render('user/index.ejs', {user: currentUser});  
})

// GET /:USERID/EDIT (EDIT PROFILE ROUTE)
router.get('/:userId/edit', async (req, res) => {
const checkVar = 0;

  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('user/edit.ejs', {
      user: currentUser, checkVar,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// PUT :USERID/USER (SAVING PROFILE UPDATES ROUTE)
router.put('/:userId/user', async (req, res) => {
const submit = req.body.submit; // Learned this condition from stack overFlow
console.log(submit)
const currentUser = await User.findById(req.session.user._id);

if(submit === "Update Profile") { // updating profile details
    try {
      currentUser.contactNo = req.body.contactNo;
      currentUser.email = req.body.email;

      await currentUser.save();

      res.redirect(`/user/${currentUser._id}/user`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
} else if(submit === "Change Password") { // updating password
    try {
      const databasePassword = currentUser.password;
      console.log(req.body);
      if(databasePassword === req.body.currentPassword){
        if(req.body.newPassword === req.body.confirmPassword) {
              currentUser.password = req.body.newPassword;

              await currentUser.save();
              
              res.redirect(`/signOut`);
        } else
        { res.redirect('/'); }
      } else
        { res.redirect('/')}
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
} else if(submit === "Update Picture") { 
    const img = req.files
} else {
      res.redirect('/');

  }
})

// GET :USERID/CHANGEPASSWORD (EDIT PASSWORD ROUTE)
router.get('/:userId/changePassword', async (req, res) => {
const checkVar = 1;

try {
  const currentUser = await User.findById(req.session.user._id);
  res.render('user/edit.ejs', {
    password: currentUser.password, checkVar,
  });
} catch (error) {
  console.log(error);
  res.redirect('/');
}
});

// PUT /:USERID/USER (SAVING PASSWORD)
// router.put('/:userId/user', async (req, res) => {
//   const submit = req.body.submit;
//   if(submit === "Change Password") {
//     try {
//       const currentUser = await User.findById(req.session.user._id);
//       const databasePassword = currentUser.password;

//       if(databasePassword === req.body.currentPassword){
//         if(req.body.newPassword === req.body.confirmPassword) {
//               currentUser.password = req.body.newPassword;
//               await currentUser.save();
//               res.redirect(`/signOut`);
//         } else
//         { res.redirect('/'); }
//       } else
//         { res.redirect('/')}
//     } catch (error) {
//       console.log(error);
//       res.redirect('/');
//     }
//   } else {
//   res.redirect('/'); // CANCEL CHANGING PASSWORD
//   }
// });


router.get('/:userId/changePic', async (req, res) => {
  const checkVar = 2;
  console.log('uploading a picture');

  try {
  const currentUser = await User.findById(req.session.user._id);
  res.render('user/edit.ejs', {
    password: currentUser.password, checkVar,
  });
} catch (error) {
  console.log(error);
  res.redirect('/');
}
});

module.exports = router;