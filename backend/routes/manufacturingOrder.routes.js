import express from "express";
import {
  createManufacturingOrder,
  getManufacturingOrders,
  getManufacturingOrderById,
  updateManufacturingOrder,
  confirmManufacturingOrder,
  startManufacturingOrder,
  updateManufacturingProgress,
  produceManufacturingOrder,
  cancelManufacturingOrder,
  deleteManufacturingOrder,
} from "../controllers/manufacturingOrder.controller.js";

const router = express.Router();

router.post("/", createManufacturingOrder);
router.get("/", getManufacturingOrders);
router.get("/:id", getManufacturingOrderById);
router.put("/:id", updateManufacturingOrder);
router.delete("/:id", deleteManufacturingOrder);

router.post("/:id/confirm", confirmManufacturingOrder);
router.post("/:id/start", startManufacturingOrder);
router.put("/:id/progress", updateManufacturingProgress);
router.post("/:id/produce", produceManufacturingOrder);
router.post("/:id/cancel", cancelManufacturingOrder);

export default router;
