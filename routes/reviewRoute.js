const {
  createReview,

  deleteReview,
  getMyReview,
} = require("../controllers/User/reviewController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/reviews/:id")
  .post(isAuthenticated, catchAsync(createReview))

  .delete(isAuthenticated, catchAsync(deleteReview));

router.route("/reviews").get(isAuthenticated, catchAsync(getMyReview));

module.exports = router;
