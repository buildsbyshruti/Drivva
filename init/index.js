const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");

Main()
  .then(() => {
    console.log("successfull");
  })
  .catch((err) => {
    console.log(err);
  });

async function Main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  await initdb();
  await mongoose.disconnect();
}

const initdb = async () => {
  await Listing.deleteMany({});
  const Listings = sampleListings.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("694fa694c6ccc3bf2f3a26d7"),
  }));
  await Listing.insertMany(Listings);
  console.log(Listings);
  console.log("data saved successfully");
};
