import express from "express";
import {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  confirmSalesOrder,
  deliverSalesOrder,
  cancelSalesOrder,
  deleteSalesOrder,
} from "../controllers/salesOrder.controller.js";

const router = express.Router();

router.post("/", createSalesOrder);
router.get("/", getSalesOrders);
router.get("/:id", getSalesOrderById);
router.put("/:id", updateSalesOrder);
router.delete("/:id", deleteSalesOrder);

// Status transition actions
router.post("/:id/confirm", confirmSalesOrder);
router.post("/:id/deliver", deliverSalesOrder);
router.post("/:id/cancel", cancelSalesOrder);

export default router;
