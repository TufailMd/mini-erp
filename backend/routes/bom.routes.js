import express from "express";
import {
  createBom,
  getBoms,
  getBomById,
  updateBom,
  deleteBom,
} from "../controllers/bom.controller.js";

const router = express.Router();

router.post("/", createBom);
router.get("/", getBoms);
router.get("/:id", getBomById);
router.put("/:id", updateBom);
router.delete("/:id", deleteBom);

export default router;
