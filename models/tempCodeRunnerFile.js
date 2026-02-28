const mongoose = require("mongoose");
const passpostLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin("passpostLocalMongoose");

const User = mongoose.model("User", userSchema);
module.exports = User;
