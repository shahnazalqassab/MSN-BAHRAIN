const express = require('express');
const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

module.exports = router;