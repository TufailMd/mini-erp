import AuditLog from "../models/auditLog.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { module, record_id, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (module) filter.module = module;
    if (record_id) filter.record_id = record_id;

    const logs = await AuditLog.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({ success: true, data: logs, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
