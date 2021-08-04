const Product = require("../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

//Prefilling parts of the Query object before getAllProducts handler.
exports.getTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings, price";
  req.query.fields = "name, price, gender, ratings";
  next();
};

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: "reviews" });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $match: { ratings: { $gte: 3 } },
    },
    {
      $group: {
        _id: { $toUpper: "$gender" },
        numProducts: { $sum: 1 },
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
