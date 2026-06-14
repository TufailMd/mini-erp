import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "ADMIN",
        "SALES_USER",
        "PURCHASE_USER",
        "MANUFACTURING_USER",
        "INVENTORY_MANAGER",
        "BUSINESS_OWNER",
      ],
      default: "SALES_USER",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);