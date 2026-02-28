const {
  getMyProfile,
  updateProfile,
  deleteProfile,
  changePassword,
} = require("../controllers/User/profile/profileController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .get(isAuthenticated, catchAsync(getMyProfile))
  .patch(isAuthenticated, catchAsync(updateProfile))
  .delete(isAuthenticated, catchAsync(deleteProfile));

router
  .route("/changePassword")
  .post(isAuthenticated, catchAsync(changePassword));

module.exports = router;
