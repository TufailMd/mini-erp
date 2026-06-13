import mongoose from "mongoose";

const purchaseOrderLineSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    product_name: {
      type: String,
      required: true,
    },

    ordered_quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    received_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    units: {
      type: String,
      default: "Units",
    },

    cost_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

purchaseOrderLineSchema.virtual("total").get(function () {
  return this.ordered_quantity * this.cost_price;
});

purchaseOrderLineSchema.set("toJSON", { virtuals: true });
purchaseOrderLineSchema.set("toObject", { virtuals: true });

const purchaseOrderSchema = new mongoose.Schema(
  {
    po_number: {
      type: String,
      required: true,
      unique: true,
    },

    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    vendor_name: {
      type: String,
      required: true,
    },

    vendor_address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    creation_date: {
      type: Date,
      default: Date.now,
    },

    responsible_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Partially Received", "Fully Received", "Cancelled"],
      default: "Draft",
    },

    auto_generated: {
      type: Boolean,
      default: false,
    },

    source_reference: {
      type: String,
      default: null,
    },

    products: {
      type: [purchaseOrderLineSchema],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "At least one product is required",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

purchaseOrderSchema.virtual("total").get(function () {
  return this.products.reduce(
    (sum, line) => sum + line.ordered_quantity * line.cost_price,
    0
  );
});

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
