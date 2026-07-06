// server/src/employees/activity-logs/activityLogs.routes.js
import { Router } from "express";
import * as activityLogsController from "./activityLogs.controller.js";

const router = Router();

router.get("/", activityLogsController.getActivityLogs);
router.post("/", activityLogsController.createActivityLog);

export default router;