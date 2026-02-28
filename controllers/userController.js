const User = require("../models/user.js");
module.exports.signUp = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      //callback
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to the wanderlust ");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "e.message");
    res.redirect("/signUp");
  }
};
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back to the Wanderlust");
  let registeredUrl = res.locals.registeredUrl || "/listings";
  res.redirect(registeredUrl);
};
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you have successfully logged out!");
    res.redirect("/listings");
  });
};
