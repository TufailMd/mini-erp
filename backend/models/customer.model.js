import mongoose from "mongoose";
import {
  formatReference,
  getNextSequence,
} from "./counter.model.js";

const GSTIN_PATTERN =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const customerSchema = new mongoose.Schema(
  {
    customer_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    normalized_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customer_type: {
      type: String,
      enum: ["INDIVIDUAL", "BUSINESS"],
      required: true,
      default: "INDIVIDUAL",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    alternate_phone: {
      type: String,
      trim: true,
    },

    billing_address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    shipping_address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    postal_code: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    company_name: {
      type: String,
      trim: true,
      maxlength: 200,
      required: function () {
        return this.customer_type === "BUSINESS";
      },
    },

    tax_id: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    gst_number: {
      type: String,
      trim: true,
      uppercase: true,
      set: function (value) {
        if (value === null || value === undefined) return undefined;

        const normalized = String(value).trim();
        return normalized ? normalized.toUpperCase() : undefined;
      },
      validate: {
        validator: function (value) {
          return !value || GSTIN_PATTERN.test(value);
        },
        message: "Invalid Indian GSTIN",
      },
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ normalized_name: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index(
  { gst_number: 1 },
  { unique: true, sparse: true }
);
customerSchema.index({ is_active: 1 });

customerSchema.pre("validate", async function () {
  if (this.name) {
    this.normalized_name = this.name.trim().toLowerCase().replace(/\s+/g, " ");
  }

  if (this.isNew && !this.customer_code) {
    const sequence = await getNextSequence("customer");
    this.customer_code = formatReference("CUS", sequence);
  }
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
