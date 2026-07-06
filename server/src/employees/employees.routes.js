// server/src/employees/employees.routes.js
import { Router } from "express";
import * as employeesController from "./employees.controller.js";
import attendanceRoutes from "./attendance/attendance.routes.js";
import shiftsRoutes from "./shifts/shifts.routes.js";
import leavesRoutes from "./leaves/leaves.routes.js";
import payrollRoutes from "./payroll/payroll.routes.js";
import incentivesRoutes from "./incentives/incentives.routes.js";
import performanceRoutes from "./performance/performance.routes.js";
import activityLogsRoutes from "./activity-logs/activityLogs.routes.js";

const router = Router();

// Mounted with no auth for now — role guards get added here later
router.get("/dashboard", employeesController.getDashboard);
router.get("/", employeesController.getEmployees);
router.get("/:id", employeesController.getEmployee);
router.post("/", employeesController.createEmployee);
router.put("/:id", employeesController.updateEmployee);
router.delete("/:id", employeesController.deleteEmployee);
router.post("/:id/account", employeesController.createLoginAccount);

// Sub-domains, nested the same way expenses/categories is
router.use("/attendance", attendanceRoutes);
router.use("/shifts", shiftsRoutes);
router.use("/leaves", leavesRoutes);
router.use("/payroll", payrollRoutes);
router.use("/incentives", incentivesRoutes);
router.use("/performance", performanceRoutes);
router.use("/activity-logs", activityLogsRoutes);

export default router;