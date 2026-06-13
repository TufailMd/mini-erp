import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    sales_price: {
      type: Number,
      required: true,
      min: 0,
    },

    cost_price: {
      type: Number,
      required: true,
      min: 0,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    on_hand_qty: {
      type: Number,
      default: 0,
      min: 0,
    },

    reserved_qty: {
      type: Number,
      default: 0,
      min: 0,
    },

    procurement_strategy: {
      type: String,
      enum: ["make_to_stock", "make_to_order"],
    },

    procure_on_demand: {
      type: Boolean,
      default: false,
    },

    procurement_type: {
      type: String,
      enum: ["purchase", "manufacturing"],
    },

    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },

    bom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bom",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("free_qty").get(function () {
  return this.on_hand_qty - this.reserved_qty;
});

export default mongoose.model("Product", productSchema);
