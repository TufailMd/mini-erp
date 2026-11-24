import express from "express";
import protect from "../middleware/auth.middleware.js";
import { objectIdSchema } from "../validators/request.schemas.js";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

const validateCustomerId = (req, res, next) => {
  const result = objectIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid ObjectId",
    });
  }
  next();
};

router.post("/", protect, createCustomer);
router.get("/", protect, getCustomers);
router.get("/:id", protect, validateCustomerId, getCustomerById);
router.put("/:id", protect, validateCustomerId, updateCustomer);
router.delete("/:id", protect, validateCustomerId, deleteCustomer);

export default router;
