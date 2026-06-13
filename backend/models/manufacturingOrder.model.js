import mongoose from "mongoose";

const moComponentSchema = new mongoose.Schema(
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

    to_consume_qty: {
      type: Number,
      required: true,
      min: 0,
    },

    consumed_qty: {
      type: Number,
      default: 0,
      min: 0,
    },

    units: {
      type: String,
      default: "Units",
    },
  },
  { _id: false }
);

const moOperationSchema = new mongoose.Schema(
  {
    operation_name: {
      type: String,
      required: true,
      trim: true,
    },

    work_center: {
      type: String,
      required: true,
      trim: true,
    },

    expected_duration: {
      type: Number,
      required: true,
      min: 0,
    },

    real_duration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const manufacturingOrderSchema = new mongoose.Schema(
  {
    mo_number: {
      type: String,
      required: true,
      unique: true,
    },

    finished_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    finished_product_name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    units: {
      type: String,
      default: "Units",
    },

    creation_date: {
      type: Date,
      default: Date.now,
    },

    schedule_date: {
      type: Date,
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    bom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bom",
      default: null,
    },

    status: {
      type: String,
      enum: ["Draft", "Confirmed", "In Progress", "Done", "Cancelled"],
      default: "Draft",
    },

    components: {
      type: [moComponentSchema],
      default: [],
    },

    operations: {
      type: [moOperationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ManufacturingOrder", manufacturingOrderSchema);
