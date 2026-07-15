// ==============================================
// src/dashboard/components/LowStockAlert.jsx
// ==============================================

import React from "react";
import {
  FiAlertTriangle,
  FiBox,
  FiArrowRight,
  FiTrendingDown,
} from "react-icons/fi";

const statusStyles = {
  Critical: {
    badge: "bg-red-100 text-red-700",
    progress: "bg-red-500",
  },
  Low: {
    badge: "bg-orange-100 text-orange-700",
    progress: "bg-orange-500",
  },
};

const LowStockAlert = ({ items = [], loading = false }) => {
  const criticalItems = items.filter(
    (item) => item.status === "Critical",
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Low Stock Alerts</h2>
          <p className="text-gray-500 mt-1">Ingredients requiring restocking</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
          <FiAlertTriangle size={28} />
        </div>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100">
        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-red-600 text-sm font-medium">Critical</p>
          <h3 className="text-3xl font-bold mt-2">
            {loading ? "—" : criticalItems}
          </h3>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-orange-600 text-sm font-medium">Total Low Stock</p>
          <h3 className="text-3xl font-bold mt-2">
            {loading ? "—" : items.length}
          </h3>
        </div>
      </div>

      {/* Item List */}

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            Loading inventory...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            All ingredients are above their minimum stock level. 🎉
          </div>
        ) : (
          items.map((item) => {
            const style = statusStyles[item.status] || statusStyles.Low;

            return (
              <div
                key={item.id}
                className="p-5 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiBox className="text-gray-500" />
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-semibold">{item.available}</span>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Minimum Required</span>
                  <span className="font-semibold">{item.minimum}</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Stock Level</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full ${style.progress}`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
          <FiTrendingDown />
          Restock Required
        </div>

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
          Manage Inventory
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;
