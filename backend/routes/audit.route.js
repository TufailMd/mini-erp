const express = require("express");
const router = express.Router();

const AuditLog = require("../models/AuditLog");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    const logs = await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  }
);

module.exports = router;