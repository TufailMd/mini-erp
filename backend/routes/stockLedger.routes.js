import express from "express";
import {
  getStockLedger,
  getStockLedgerByProduct,
  createManualAdjustment,
} from "../controllers/stockLedger.controller.js";

const router = express.Router();

router.get("/", getStockLedger);
router.get("/:productId", getStockLedgerByProduct);
router.post("/adjustment", createManualAdjustment);

export default router;