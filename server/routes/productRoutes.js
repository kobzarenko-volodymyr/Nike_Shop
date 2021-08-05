const express = require("express");
const productController = require("../controllers/productController");
const authController = require("./../controllers/authController");
const handlerFactory = require("./../controllers/handlerFactory");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

//Nested route POST, GET /product/productId/reviews
router.use(
  "/:productId/reviews",
  handlerFactory.nestedRoute({ param: "productId", modelField: "product" }),
  reviewRouter
);

router.route("/product-stats").get(productController.getProductStats);

router
  .route("/top-5-cheap")
  .get(productController.getTopProducts, productController.getAllProducts);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
