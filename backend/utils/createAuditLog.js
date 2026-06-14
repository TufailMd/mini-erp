import AuditLog from "../models/AuditLog.js";

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

export default createAuditLog;