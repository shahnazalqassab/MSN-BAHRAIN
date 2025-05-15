const express = require('express');
const router = express.Router();
const User = require('../models/user');
//signin

router.get("/signIn", (req, res) => {
  res.render("Auth/signIn.ejs");
});

router.post("/signIn", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.send("Invalid credentials");
    }

    req.session.user = { _id: user._id, username: user.username };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/Auth/signIn");
  }
});



//signUp router

router.get("/signUp", (req, res) => {
  res.render("auth/signUp.ejs");
});

router.post("/signUp", async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) return res.send("Username already taken");

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Passwords do not match");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({ username: req.body.username, password: hashedPassword });
    req.session.user = { _id: user._id, username: user.username };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/Auth/signUp");
  }
});

router.get("/signUp", (req, res) => {
  res.render("Auth/signUp.ejs");
});




module.exports = router;