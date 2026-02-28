const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js");
router
  .route("/signUp")
  .get((req, res) => {
    res.render("user/signUp");
  })
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(async (req, res) => {
    res.render("user/logIn");
  })
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

router.get("/logOut", userController.logout);
module.exports = router;
