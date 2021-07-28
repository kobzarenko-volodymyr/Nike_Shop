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
const authController = require("./../controllers/authController");

router.route("/product-stats").get(getProductStats);

router.route("/top-5-cheap").get(getTopProducts, getAllProducts);

router
  .route("/")
  .get(authController.protect, getAllProducts)
  .post(createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteProduct
  );

module.exports = router;
