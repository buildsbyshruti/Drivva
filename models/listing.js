const mongoose = require("mongoose");
const review = require("./review.js");
const User = require("./user.js");

const listingschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  collaboration: String,
  price: Number,
  image: {
    filename: {
      type: String,
      default: "listing-image",
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["UI/UX", "Frontend", "Backend", "Full Stack", "AI/ML"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Listing = mongoose.model("Listing", listingschema);

module.exports = Listing;
