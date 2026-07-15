// ==============================================
// src/dashboard/dashboardService.js
// ==============================================

import { apiRequest } from "../api/apiClient";

// ==============================================
// GET DASHBOARD SUMMARY
// Returns the role-appropriate bundle of dashboard data in one call.
// ==============================================

const getDashboardSummary = async (period = "daily") => {
  const { ok, data } = await apiRequest(
    `/dashboard/summary?period=${encodeURIComponent(period)}`,
  );

  if (!ok || !data?.success) {
    return {
      success: false,
      message: data?.message || "Unable to load dashboard data.",
    };
  }

  return { success: true, data: data.data };
};

// ==============================================
// GET SALES CHART (used when switching daily/weekly/monthly)
// ==============================================

const getSalesChart = async (period = "daily") => {
  const { ok, data } = await apiRequest(
    `/dashboard/sales-chart?period=${encodeURIComponent(period)}`,
  );

  if (!ok || !data?.success) {
    return {
      success: false,
      message: data?.message || "Unable to load sales chart.",
    };
  }

  return { success: true, data: data.data };
};

const dashboardService = { getDashboardSummary, getSalesChart };

export default dashboardService;
