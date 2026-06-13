import express from "express";
import {
  getInventoryDashboard,
  getLowStockAlerts,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.get("/dashboard", getInventoryDashboard);
router.get("/low-stock", getLowStockAlerts);

export default router;