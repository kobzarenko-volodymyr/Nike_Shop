const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Don't able to create two Reviews from the same User
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      //Select all the Reviews that belong to the current Product
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 2.0,
    });
  }
};

//Call function each time after a new review has been Created
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

//Update the statistics whenever a review is Edited or Deleted
// findByIdAndUpdate or findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //get current Review
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
