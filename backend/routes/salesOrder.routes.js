import express from "express";
import protect from "../middleware/auth.middleware.js";
import { objectIdSchema } from "../validators/request.schemas.js";
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

const validateSalesOrderId = (req, res, next) => {
  const result = objectIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid ObjectId",
    });
  }
  next();
};

router.post("/", createSalesOrder);
router.get("/", getSalesOrders);
router.get("/:id", getSalesOrderById);
router.put("/:id", protect, validateSalesOrderId, updateSalesOrder);
router.delete("/:id", deleteSalesOrder);

// Status transition actions
router.post("/:id/confirm", confirmSalesOrder);
router.post("/:id/deliver", deliverSalesOrder);
router.post("/:id/cancel", cancelSalesOrder);

export default router;
