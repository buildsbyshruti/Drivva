const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviewController.js");

const {
  isLoggedIn,
  isReviewOwner,
  validateReview,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.newReview)
);

router.delete(
  "/:reviewId",
  isReviewOwner,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
