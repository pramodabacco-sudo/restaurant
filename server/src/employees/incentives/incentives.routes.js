// server/src/employees/incentives/incentives.routes.js
import { Router } from "express";
import * as incentivesController from "./incentives.controller.js";

const router = Router();

router.get("/", incentivesController.getIncentives);
router.post("/", incentivesController.createIncentive);

export default router;