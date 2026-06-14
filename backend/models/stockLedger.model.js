import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    transaction_type: {
      type: String,
      enum: [
        "purchase_receipt",
        "sales_delivery",
        "manufacturing_produce",
        "manufacturing_consume",
        "manual_adjustment",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    balance_after: {
      type: Number,
      required: true,
    },

    reference_type: {
      type: String,
      enum: ["SalesOrder", "PurchaseOrder", "ManufacturingOrder", "Manual"],
      required: true,
    },

    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

stockLedgerSchema.index({ product_id: 1, createdAt: -1 });

export default mongoose.model("StockLedger", stockLedgerSchema);