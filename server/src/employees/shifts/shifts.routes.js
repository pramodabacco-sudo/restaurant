// server/src/employees/shifts/shifts.routes.js
import { Router } from "express";
import * as shiftsController from "./shifts.controller.js";

const router = Router();

router.get("/", shiftsController.getShifts);
router.post("/", shiftsController.createShift);
router.put("/:id", shiftsController.updateShift);
router.delete("/:id", shiftsController.deleteShift);
router.post("/:id/assign", shiftsController.assignShift);
router.get("/assignments/list", shiftsController.getAssignments);

export default router;