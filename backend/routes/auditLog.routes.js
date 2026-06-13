import express from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";

const router = express.Router();

router.get("/", getAuditLogs);

export default router;
