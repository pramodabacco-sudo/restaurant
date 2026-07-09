// server/src/employees/attendance/attendance.routes.js
import { Router } from "express";
import * as attendanceController from "./attendance.controller.js";

const router = Router();

router.get("/", attendanceController.getAttendance);
router.get("/:employeeId/logs", attendanceController.getEmployeeLogs);
router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.post("/break", attendanceController.recordBreak);
router.put("/status", attendanceController.markStatus);
router.post("/close-day", attendanceController.closeDayAttendance);

export default router;
