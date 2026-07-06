// server/src/employees/performance/performance.routes.js
import { Router } from "express";
import * as performanceController from "./performance.controller.js";

const router = Router();

router.get("/", performanceController.getPerformance);
router.post("/", performanceController.upsertPerformance);

export default router;