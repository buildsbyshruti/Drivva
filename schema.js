const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    // image: Joi.object({
    //   filename: Joi.string(),
    //   url: Joi.string(),
    // }),
    category: Joi.string()
      .valid("UI/UX", "Frontend", "Backend", "Full Stack", "AI/ML")
      .required(),
  }),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    content: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
  }).required(),
});
