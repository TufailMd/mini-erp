import AuditLog from "../models/auditLog.model.js";

/**
 * Write a single audit log entry (Created / Deleted / Status Changed).
 *
 * @param {Object} opts
 * @param {string}  opts.module           - "Sales" | "Purchase" | "Manufacturing" | "Product" | "BoM"
 * @param {ObjectId} opts.record_id       - MongoDB _id of the document
 * @param {string}  opts.record_reference - Human-readable ref, e.g. "SO-000001"
 * @param {string}  opts.action           - "Created" | "Updated" | "Deleted" | "Status Changed"
 * @param {*}       [opts.user]           - User ObjectId (optional)
 * @param {*}       [opts.session]        - Mongoose session (optional)
 */
export async function writeAuditLog({
  module,
  record_id,
  record_reference,
  action,
  user = null,
  session = null,
}) {
  try {
    const doc = {
      module,
      record_id,
      record_reference,
      action,
      user,
    };

    if (session) {
      await AuditLog.create([doc], { session });
    } else {
      await AuditLog.create(doc);
    }
  } catch (err) {
    // Non-fatal: audit failures must never break the main transaction
    console.error("[auditLogHelper] writeAuditLog error:", err.message);
  }
}

/**
 * Diff two plain objects and write one audit-log entry per changed field.
 *
 * @param {Object}   opts
 * @param {string}   opts.module
 * @param {ObjectId} opts.record_id
 * @param {string}   opts.record_reference
 * @param {Object}   opts.before           - Document state before the save
 * @param {Object}   opts.after            - Document state after the save
 * @param {string[]} opts.fieldsToTrack    - Only diff these fields
 * @param {*}        [opts.user]
 * @param {*}        [opts.session]
 */
export async function writeFieldChangeLogs({
  module,
  record_id,
  record_reference,
  before,
  after,
  fieldsToTrack,
  user = null,
  session = null,
}) {
  try {
    const logs = [];

    for (const field of fieldsToTrack) {
      const oldVal = JSON.stringify(before[field] ?? null);
      const newVal = JSON.stringify(after[field] ?? null);

      if (oldVal !== newVal) {
        logs.push({
          module,
          record_id,
          record_reference,
          action: "Updated",
          field_changed: field,
          old_value: before[field] ?? null,
          new_value: after[field] ?? null,
          user,
        });
      }
    }

    if (logs.length === 0) return;

    if (session) {
      await AuditLog.insertMany(logs, { session });
    } else {
      await AuditLog.insertMany(logs);
    }
  } catch (err) {
    console.error("[auditLogHelper] writeFieldChangeLogs error:", err.message);
  }
}
