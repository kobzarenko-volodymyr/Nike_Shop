const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, enter product name"],
    trim: true,
    maxlength: [
      70,
      "A product name must have less or equal then 40 characters",
    ],
    minlength: [5, "A product name must have more or equal then 10 characters"],
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "Please, enter product price"],
    maxLength: [5, "Product name cannot exceed 5 characters"],
    default: 0,
  },
  gender: {
    type: String,
    required: [true, "Please, specify gender"],
    enum: {
      values: ["Male", "Female"],
      message: "Gender is either: Male or Female",
    },
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please, enter product description"],
  },
  images: [String],
  colors: [String],
  sizes: [Number],
  ratings: {
    type: Number,
    default: 0.0,
    min: [0, "Rating must be above 0.0"],
    max: [5, "Rating must be below 5.0"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Virtual populate!!!
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
