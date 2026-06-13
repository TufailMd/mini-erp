const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
    });
  } catch (error) {
    console.log("Audit Log Error:", error);
  }
};

module.exports = createAuditLog;