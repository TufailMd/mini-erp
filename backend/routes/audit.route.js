import express from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getAuditLogs);

export default router;


