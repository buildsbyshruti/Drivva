const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressError.js");

module.exports.newReview = async (req, res) => {
  let { id } = req.params;
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  req.flash("success", "New Review created successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
