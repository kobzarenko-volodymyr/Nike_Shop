const Product = require("../models/product");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//Prefilling parts of the Query object before getAllProducts handler.
exports.getTopProducts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings, price";
  req.query.fields = "name, price, gender, ratings";
  next();
};

exports.getAllProducts = catchAsync(async (req, res) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();
  const products = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    result: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
