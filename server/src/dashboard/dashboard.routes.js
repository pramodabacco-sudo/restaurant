// ==============================================
// server/src/dashboard/dashboard.routes.js
// ==============================================

import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import {
  getDashboardSummary,
  getSalesChartData,
} from "./dashboard.controller.js";

const router = Router();

// Every dashboard route just needs a valid logged-in user — the controller
// itself decides which data to hand back based on req.user.role.
router.get("/summary", requireAuth, getDashboardSummary);
router.get("/sales-chart", requireAuth, getSalesChartData);

export default router;
