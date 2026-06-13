const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/user.controllers.js");

// Get all users
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getUsers
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateUser
);

// Delete user
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteUser
);

module.exports = router;