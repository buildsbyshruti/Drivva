const mongoose = require("mongoose");
const User = require("./user.js");
const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("review", reviewSchema);
