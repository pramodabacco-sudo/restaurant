// server/src/employees/leaves/leaves.routes.js
import { Router } from "express";
import * as leavesController from "./leaves.controller.js";

const router = Router();

router.get("/", leavesController.getLeaves);
router.post("/", leavesController.createLeave);
router.put("/:id/approve", leavesController.approveLeave);
router.put("/:id/reject", leavesController.rejectLeave);

export default router;