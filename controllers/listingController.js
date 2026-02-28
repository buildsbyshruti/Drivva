const Listing = require("../models/listing.js");
const ALLOWED_CATEGORIES = [
  "UI/UX",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI/ML",
];

module.exports.index = async (req, res) => {
  let { category } = req.query;

  let Alllistings;
  let selectedCategory = "All";

  if (category) {
    category = category.trim();
  }

  if (category && ALLOWED_CATEGORIES.includes(category)) {
    Alllistings = await Listing.find({ category });
    selectedCategory = category;
  } else if (category && category !== "All") {
    req.flash(
      "error",
      "The selected category does not exist. Please choose a valid service.",
    );
    return res.redirect("/listings");
  } else {
    Alllistings = await Listing.find({});
  }

  res.render("templates/index.ejs", {
    Alllistings,
    selectedCategory,
  });
};

module.exports.newListing = async (req, res) => {
  res.render("templates/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you asked for, does not exits");
    return res.redirect("/listings");
  }
  res.render("templates/show.ejs", { listing });
};
module.exports.postNewListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user && req.user._id;
  if (req.file) {
    const file = req.file;
    const url = file.path || file.secure_url || file.location || file.url || "";
    const filename = file.filename || file.originalname || "listing-image";
    newListing.image = { url, filename };
  }

  await newListing.save();
  req.flash("success", "New Listing saved successfully");
  res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalListingURL = listing.image.url;
  originalListingURL.replace("/uploads", "/uploads/h_300,w_250");

  res.render("templates/edit.ejs", { listing, originalListingURL });
};
module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send a valid listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    const file = req.file;
    const url = file.path || file.secure_url || file.location || file.url || "";
    const filename = file.filename || file.originalname || "listing-image";
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully");
  res.redirect("/listings");
};

module.exports.toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const alreadyLiked = listing.likedBy.includes(userId);

  if (alreadyLiked) {
    listing.likedBy.pull(userId);
    listing.likes = Math.max(0, listing.likes - 1);
  } else {
    listing.likedBy.push(userId);
    listing.likes = listing.likes + 1;
  }

  await listing.save();

  res.json({
    liked: !alreadyLiked,
    likes: listing.likes,
  });
};
