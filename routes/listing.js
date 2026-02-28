const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postNewListing),
  );

router.get("/new", isLoggedIn, wrapAsync(listingController.newListing));

router.get("/:id/edit", isOwner, wrapAsync(listingController.editListing));

router.post("/:id/like", isLoggedIn, wrapAsync(listingController.toggleLike));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
