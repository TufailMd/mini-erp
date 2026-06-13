import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  confirmPurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
  deletePurchaseOrder,
} from "../controllers/purchaseOrder.controller.js";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);

router.post("/:id/confirm", confirmPurchaseOrder);
router.post("/:id/receive", receivePurchaseOrder);
router.post("/:id/cancel", cancelPurchaseOrder);

export default router;
