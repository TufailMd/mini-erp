import mongoose from "mongoose";

const salesOrderLineSchema = new mongoose.Schema(
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


    availability: {
      type: Number,
      default: 0,
    },

    ordered_quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    delivered_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    units: {
      type: String,
      default: "Units",
    },

    sales_unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

salesOrderLineSchema.virtual("total").get(function () {
  return this.ordered_quantity * this.sales_unit_price;
});

salesOrderLineSchema.set("toJSON", { virtuals: true });
salesOrderLineSchema.set("toObject", { virtuals: true });

const salesOrderSchema = new mongoose.Schema(
  {
    so_number: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: String,
      required: true,
      trim: true,
    },

    customer_address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    creation_date: {
      type: Date,
      default: Date.now,
    },

    sales_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Partially Delivered", "Fully Delivered", "Cancelled"],
      default: "Draft",
    },

    products: {
      type: [salesOrderLineSchema],
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

salesOrderSchema.virtual("total").get(function () {
  return this.products.reduce(
    (sum, line) => sum + line.ordered_quantity * line.sales_unit_price,
    0
  );
});

export default mongoose.model("SalesOrder", salesOrderSchema);
