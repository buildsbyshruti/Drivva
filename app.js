if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_ATLAS_URL;

Main()
  .then(() => {
    console.log("successfull");
  })
  .catch((err) => {
    console.log(err);
  });

async function Main() {
  await mongoose.connect(dbUrl);
}

const path = require("path");
const User = require("./models/user.js");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const _connectMongo = require("connect-mongo");
let MongoStore =
  _connectMongo && _connectMongo.default
    ? _connectMongo.default
    : _connectMongo;
const flash = require("connect-flash");
const passport = require("passport");

const listing_route = require("./routes/listing.js");
const review_route = require("./routes/review.js");
const user_route = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

let store;
if (MongoStore && typeof MongoStore.create === "function") {
  store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: "mySuperSecretCode",
    },
    touchAfter: 24 * 3600,
  });
} else if (typeof MongoStore === "function") {
  const MongoStoreFactory = MongoStore(session);
  store = new MongoStoreFactory({
    url: process.env.MONGO_ATLAS_URL,
    touchAfter: 24 * 3600,
  });
} else {
  throw new Error(
    "Unsupported connect-mongo version: cannot create session store"
  );
}
const sessionOption = {
  store,
  secret: "mySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    Expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
store.on("error", (err) => {
  console.log("Session store error:", err);
});
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listing_route);
app.use("/listings/:id/reviews", review_route);
app.use("/", user_route);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res
    .status(status)
    .render("templates/error.ejs", { statusCode: status, message });
});

app.listen(8080, (req, res) => {
  console.log("app is listening");
});
