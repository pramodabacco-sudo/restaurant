// server/src/employees/payroll/payroll.routes.js
import { Router } from "express";
import * as payrollController from "./payroll.controller.js";

const router = Router();

router.get("/", payrollController.getPayroll);
router.post("/", payrollController.generatePayroll);
router.put("/:id/pay", payrollController.payPayroll);

export default router;