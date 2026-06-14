import mongoose from "mongoose";
import StockLedger from "../models/stockLedger.model.js";
import Product from "../models/product.model.js";

export const getStockLedger = async (req, res) => {
  try {
    const { page = 1, limit = 20, product_id, transaction_type } = req.query;
    const filter = {};

    if (product_id) filter.product_id = product_id;
    if (transaction_type) filter.transaction_type = transaction_type;

    const logs = await StockLedger.find(filter)
      .populate("product_id created_by")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await StockLedger.countDocuments(filter);

    res.json({ success: true, data: logs, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStockLedgerByProduct = async (req, res) => {
  try {
    const logs = await StockLedger.find({ product_id: req.params.productId })
      .populate("created_by")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createManualAdjustment = async (req, res) => {  try {    const { product_id, quantity, notes, created_by } = req.body;

    const product = await Product.findById(product_id);
    if (!product) throw new Error("Product not found");

    const newBalance = product.on_hand_qty + quantity;
    if (newBalance < 0) throw new Error("Resulting stock cannot be negative");

    product.on_hand_qty = newBalance;
    await product.save();

    const ledgerEntry = await StockLedger.create(
      [
        {
          product_id,
          transaction_type: "manual_adjustment",
          quantity,
          balance_after: newBalance,
          reference_type: "Manual",
          reference_id: product_id,
          notes,
          created_by,
        },
      ]
    );    res.status(201).json({ success: true, data: { product, ledger: ledgerEntry[0] } });
  } catch (err) {    res.status(400).json({ success: false, message: err.message });
  } finally {  }
};