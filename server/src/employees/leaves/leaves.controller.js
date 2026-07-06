// server/src/employees/leaves/leaves.controller.js
import * as leavesService from "./leaves.service.js";

export async function getLeaves(req, res) {
  try {
    res.json(await leavesService.listLeaves(req.query));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leave requests", error: err.message });
  }
}

export async function createLeave(req, res) {
  try {
    res.status(201).json(await leavesService.createLeaveRequest(req.body));
  } catch (err) {
    res.status(400).json({ message: "Failed to create leave request", error: err.message });
  }
}

export async function approveLeave(req, res) {
  try {
    const { approvedById } = req.body;
    res.json(await leavesService.decideLeaveRequest(req.params.id, { status: "APPROVED", approvedById }));
  } catch (err) {
    res.status(400).json({ message: "Failed to approve leave request", error: err.message });
  }
}

export async function rejectLeave(req, res) {
  try {
    const { approvedById } = req.body;
    res.json(await leavesService.decideLeaveRequest(req.params.id, { status: "REJECTED", approvedById }));
  } catch (err) {
    res.status(400).json({ message: "Failed to reject leave request", error: err.message });
  }
}