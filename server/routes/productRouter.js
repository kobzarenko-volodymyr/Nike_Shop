const express = require("express");

const router = express.Router();

const {
  getProductStats,
  getTopProducts,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/product-stats").get(getProductStats);

router.route("/top-5-cheap").get(getTopProducts, getAllProducts);

router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
