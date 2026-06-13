import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      enum: ["Sales", "Purchase", "Manufacturing", "Product", "BoM"],
      required: true,
    },

    record_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    record_reference: {
      // e.g. SO-000001, PO-000001
      type: String,
    },

    action: {
      type: String,
      enum: ["Created", "Updated", "Deleted", "Status Changed"],
      required: true,
    },

    field_changed: {
      type: String,
    },

    old_value: {
      type: mongoose.Schema.Types.Mixed,
    },

    new_value: {
      type: mongoose.Schema.Types.Mixed,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ module: 1, record_id: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
