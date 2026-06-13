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
      // required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    sales_price: {
      type: Number,
      default: 0,
      min: 0,
    },

    cost_price: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      filename: {
        type: String,
        default: "listingimage",
      },
      url: {
        type: String,
        required: true,
        default:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
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

    low_stock_threshold: {
      type: Number,
      default: 0,
      min: 0,
    },

    procure_on_demand: {
      type: Boolean,
      default: false,
    },

    procurement_type: {
      type: String,
      enum: ["purchase", "manufacturing"],
      required: function () {
        return this.procure_on_demand === true;
      },
    },

    procurement_strategy: {
      type: String,
      enum: ["MTS", "MTO"],
      default: "MTS",
    },

    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: function () {
        return (
          this.procure_on_demand === true &&
          this.procurement_type === "purchase"
        );
      },
    },

    bom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bom",
      required: function () {
        return (
          this.procure_on_demand === true &&
          this.procurement_type === "manufacturing"
        );
      },
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("free_qty").get(function () {
  return this.on_hand_qty - (this.reserved_qty || 0);
});

productSchema.pre("validate", function () {
  if (this.procure_on_demand) {
    if (!this.procurement_type) {
      throw new Error(
        "procurement_type is required when procure_on_demand is checked",
      );
    }
    if (this.procurement_type === "purchase" && !this.vendor_id) {
      throw new Error(
        "vendor_id is required when procurement_type is 'purchase'",
      );
    }
    if (this.procurement_type === "manufacturing" && !this.bom_id) {
      throw new Error(
        "bom_id is required when procurement_type is 'manufacturing'",
      );
    }
  } else {
    this.procurement_type = undefined;
    this.vendor_id = undefined;
    this.bom_id = undefined;
  }
});

export default mongoose.model("Product", productSchema);