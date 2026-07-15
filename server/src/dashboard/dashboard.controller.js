// ==============================================
// server/src/dashboard/dashboard.controller.js
// Decides WHAT data to send based on req.user.role (populated by requireAuth).
// Each role only gets the sections relevant to their job — owners/admins see
// everything, waiters only see their own active orders, etc.
// ==============================================

import * as dashboardService from "./dashboard.service.js";

const OWNER_LIKE = ["OWNER", "ADMIN"];
const MANAGER_LIKE = ["MANAGER"];
const CASHIER_LIKE = ["CASHIER"];
const KITCHEN_LIKE = ["KITCHEN", "CHEF"];
const WAITER_LIKE = ["WAITER"];
const STORE_KEEPER_LIKE = ["STORE_KEEPER"];

// ==============================================
// GET /api/dashboard/summary
// ==============================================

export const getDashboardSummary = async (req, res) => {
  try {
    const role = req.user?.role;
    const store = req.user?.store || "Main Store";
    const period = ["daily", "weekly", "monthly"].includes(req.query.period)
      ? req.query.period
      : "daily";

    const response = { role };

    if (OWNER_LIKE.includes(role) || MANAGER_LIKE.includes(role)) {
      // ------------------------------------------
      // OWNER / ADMIN / MANAGER — full operational view
      // ------------------------------------------
      const [
        stats,
        salesChart,
        kitchenStatus,
        recentOrders,
        lowStockAlerts,
        paymentSummary,
        topSellingItems,
        recentActivities,
      ] = await Promise.all([
        dashboardService.getTodayStats(store),
        dashboardService.getSalesChart(period, store),
        dashboardService.getKitchenStatus(store),
        dashboardService.getRecentOrders({ store, limit: 5 }),
        dashboardService.getLowStockAlerts(),
        dashboardService.getPaymentSummary(store),
        dashboardService.getTopSellingItems({ store, limit: 5 }),
        dashboardService.getRecentActivities({ limit: 6 }),
      ]);

      Object.assign(response, {
        stats,
        salesChart,
        kitchenStatus,
        recentOrders,
        lowStockAlerts,
        paymentSummary,
        topSellingItems,
        recentActivities,
      });
    } else if (CASHIER_LIKE.includes(role)) {
      // ------------------------------------------
      // CASHIER — orders + payments, no inventory/kitchen internals
      // ------------------------------------------
      const [stats, recentOrders, paymentSummary] = await Promise.all([
        dashboardService.getTodayStats(store),
        dashboardService.getRecentOrders({ store, limit: 8 }),
        dashboardService.getPaymentSummary(store),
      ]);

      response.stats = {
        orders: stats.orders,
        customers: stats.customers,
        avgOrder: stats.avgOrder,
      };
      response.recentOrders = recentOrders;
      response.paymentSummary = paymentSummary;
    } else if (KITCHEN_LIKE.includes(role)) {
      // ------------------------------------------
      // KITCHEN / CHEF — kitchen load + relevant orders, no financials
      // ------------------------------------------
      const [kitchenStatus, recentOrders] = await Promise.all([
        dashboardService.getKitchenStatus(store),
        dashboardService.getRecentOrders({ store, limit: 8 }),
      ]);

      response.kitchenStatus = kitchenStatus;
      response.recentOrders = recentOrders;
    } else if (WAITER_LIKE.includes(role)) {
      // ------------------------------------------
      // WAITER — only their own active orders + table occupancy
      // ------------------------------------------
      const [waiterSummary, myOrders] = await Promise.all([
        dashboardService.getWaiterSummary(req.user.id, store),
        dashboardService.getRecentOrders({
          store,
          limit: 8,
          waiterId: req.user.id,
        }),
      ]);

      response.waiterSummary = waiterSummary;
      response.recentOrders = myOrders;
    } else if (STORE_KEEPER_LIKE.includes(role)) {
      // ------------------------------------------
      // STORE KEEPER — inventory only
      // ------------------------------------------
      response.lowStockAlerts = await dashboardService.getLowStockAlerts();
    } else {
      // Unknown/unsupported role — return an empty-but-valid shape
      response.stats = null;
    }

    res.json({ success: true, data: response });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load dashboard data. Please try again.",
    });
  }
};

// ==============================================
// GET /api/dashboard/sales-chart?period=daily|weekly|monthly
// Separate endpoint so the period toggle can refetch without reloading
// the whole dashboard.
// ==============================================

export const getSalesChartData = async (req, res) => {
  try {
    const role = req.user?.role;

    if (!["OWNER", "ADMIN", "MANAGER"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view sales analytics.",
      });
    }

    const store = req.user?.store || "Main Store";
    const period = ["daily", "weekly", "monthly"].includes(req.query.period)
      ? req.query.period
      : "daily";

    const data = await dashboardService.getSalesChart(period, store);

    res.json({ success: true, data });
  } catch (err) {
    console.error("Sales chart error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load sales chart.",
    });
  }
};
