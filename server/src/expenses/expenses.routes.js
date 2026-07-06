import { Router } from "express";
import * as expenseController from "./expenses.controller.js";
import categoriesRoutes from "./categories/expenseCategories.routes.js";

const router = Router();

// Sub-resources — mount before the generic /:id route below
router.use("/categories", categoriesRoutes);

// Dashboard & reports (must come before "/:id" or "dashboard"/"reports"
// would be swallowed as an :id param)
router.get("/dashboard", expenseController.getDashboard);
router.get("/reports", expenseController.getReports);

// Core expense CRUD
router.get("/", expenseController.getAllExpenses);
router.get("/:id", expenseController.getExpenseById);
router.post("/", expenseController.createExpense);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
router.post("/:id/approve", expenseController.approveExpense);

export default router;