const {
  getUsers,
  deleteUser,
} = require("../controllers/admin/user/adminUserController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/users")
  .get(isAuthenticated, restrictTo("admin"), catchAsync(getUsers));

router
  .route("/users/:id")
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteUser));

module.exports = router;
