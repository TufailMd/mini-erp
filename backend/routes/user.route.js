import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

// Read — any authenticated user can fetch users (needed by detail pages)
router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);

// Write — ADMIN only
router.post("/", protect, authorize("ADMIN"), createUser);
router.put("/:id", protect, authorize("ADMIN"), updateUser);
router.delete("/:id", protect, authorize("ADMIN"), deleteUser);

export default router;