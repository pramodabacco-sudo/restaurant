import * as expenseService from "./expenses.service.js";

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.query);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body, req.body.createdBy);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updated = await expenseService.updateExpense(req.params.id, req.body, req.body.updatedBy);
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const deleted = await expenseService.deleteExpense(req.params.id, req.query.userId);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveExpense = async (req, res) => {
  try {
    const { action, level, approverId, comment } = req.body;
    if (!["APPROVED", "REJECTED"].includes(action)) {
      return res.status(400).json({ error: "action must be APPROVED or REJECTED" });
    }
    const updated = await expenseService.approveExpense(req.params.id, {
      action,
      level,
      approverId,
      comment,
    });
    if (!updated) return res.status(404).json({ error: "Expense not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await expenseService.getDashboard(req.query.store);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const report = await expenseService.getReports(req.query);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};