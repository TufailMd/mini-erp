import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    component_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    component_name: {
      type: String,
      required: true,
    },

    to_consume_qty: {
      type: Number,
      required: true,
      min: 0.01,
    },

    units: {
      type: String,
      default: "Units",
    },
  },
  { _id: false }
);

const operationSchema = new mongoose.Schema(
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
      min: 1,
    },
  },
  { _id: false }
);

const bomSchema = new mongoose.Schema(
  {
    bom_number: {
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

    reference: {
      type: String,
      trim: true,
      maxlength: 8,
    },

    components: {
      type: [componentSchema],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "At least one component is required",
      },
    },

    operations: {
      type: [operationSchema],
      default: [],
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bom", bomSchema);
