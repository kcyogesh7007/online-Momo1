const {
  createProduct,

  updateProduct,
  deleteProduct,
} = require("../controllers/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const upload = require("../middleware/multerConfig");
const catchAsync = require("../services/catchAsync");
const {
  getProducts,
  getProduct,
} = require("../controllers/global/globalController");

const router = require("express").Router();

router
  .route("/products")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct),
  )
  .get(catchAsync(getProducts));
router
  .route("/products/:id")
  .get(catchAsync(getProduct))
  .patch(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(updateProduct),
  )
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteProduct));

module.exports = router;
