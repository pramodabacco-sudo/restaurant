// ==============================================
// src/dashboard/components/TopSellingItems.jsx
// ==============================================

import React from "react";
import { FiTrendingUp, FiShoppingBag, FiArrowRight } from "react-icons/fi";

const badgeColors = [
  "bg-orange-100 text-orange-600",
  "bg-red-100 text-red-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
];

const TopSellingItems = ({ items = [], loading = false }) => {
  const totalSold = items.reduce((sum, item) => sum + item.sold, 0);
  const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Top Selling Items
          </h2>
          <p className="text-gray-500 mt-1">Best performing menu items today</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
          <FiTrendingUp size={28} />
        </div>
      </div>

      {/* List */}

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            Loading top items...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No items sold yet today.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        badgeColors[index % badgeColors.length]
                      }`}
                    >
                      <FiShoppingBag />
                    </div>

                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h4 className="text-xl font-bold text-gray-800">
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{item.sold} Sold</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}

      <div className="grid grid-cols-2 border-t border-gray-100">
        <div className="text-center py-5">
          <p className="text-sm text-gray-500">Total Sold</p>
          <h3 className="text-2xl font-bold mt-2">
            {loading ? "—" : totalSold}
          </h3>
        </div>

        <div className="text-center py-5 border-l border-gray-100">
          <p className="text-sm text-gray-500">Revenue</p>
          <h3 className="text-2xl font-bold mt-2">
            {loading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          </h3>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <FiTrendingUp />
          Sales Increasing
        </div>

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
          View Menu Analytics
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TopSellingItems;
