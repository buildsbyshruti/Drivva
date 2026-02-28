let { listingSchema } = require("./schema.js");
let { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/expressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.registeredUrl = req.originalUrl;
    req.flash("error", "You need to login first");
    return req.session.save(() => {
      res.redirect("/login");
    });
  }
  next();
};
module.exports.savedUrl = (req, res, next) => {
  if (req.session.registeredUrl) {
    res.locals.registeredUrl = req.session.registeredUrl;
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  //middleware
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if (!req.user) {
    req.flash("error", "You must be logged in to do that");
    return res.redirect(`/listings/${id}`);
  }
  const ownerId =
    listing.owner && listing.owner._id
      ? listing.owner._id.toString()
      : String(listing.owner);
  if (ownerId !== String(req.user._id)) {
    req.flash("error", "you are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!req.user) {
    req.flash("error", "You must be logged in to do that");
    return res.redirect(`/listings/${id}`);
  }
  // Allow deletion if the current user is the review author or the listing owner
  const listing = await Listing.findById(id);
  const isReviewAuthor = String(review.author) === String(req.user._id);
  const isListingOwner =
    listing && listing.owner && String(listing.owner) === String(req.user._id);
  if (!isReviewAuthor && !isListingOwner) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    return next();
  }
};
