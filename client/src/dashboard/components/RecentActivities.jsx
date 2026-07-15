// ==============================================
// src/dashboard/components/RecentActivities.jsx
// ==============================================

import React from "react";
import {
  FiShoppingCart,
  FiDollarSign,
  FiUserPlus,
  FiBox,
  FiCoffee,
  FiCheckCircle,
  FiActivity,
  FiArrowRight,
} from "react-icons/fi";
import { formatTimeAgo } from "../utils/format";

// Picks an icon/color based on keywords in the activity title, since the
// backend ActivityLog only stores a free-text `action` string.
const getActivityVisual = (title = "") => {
  const t = title.toLowerCase();

  if (t.includes("order"))
    return {
      icon: <FiShoppingCart />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    };
  if (t.includes("payment"))
    return {
      icon: <FiDollarSign />,
      bg: "bg-green-100",
      color: "text-green-600",
    };
  if (t.includes("customer"))
    return {
      icon: <FiUserPlus />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    };
  if (t.includes("stock") || t.includes("inventory"))
    return { icon: <FiBox />, bg: "bg-red-100", color: "text-red-600" };
  if (t.includes("kitchen"))
    return {
      icon: <FiCoffee />,
      bg: "bg-orange-100",
      color: "text-orange-600",
    };
  if (t.includes("complete"))
    return {
      icon: <FiCheckCircle />,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    };

  return { icon: <FiActivity />, bg: "bg-gray-100", color: "text-gray-600" };
};

const RecentActivities = ({ activities = [], loading = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Activities
          </h2>
          <p className="text-gray-500 mt-1">Latest restaurant activities</p>
        </div>

        <button className="text-blue-600 hover:text-blue-700 font-semibold transition">
          View All
        </button>
      </div>

      {/* Timeline */}

      <div className="max-h-[560px] overflow-y-auto p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No recent activity.
          </div>
        ) : (
          activities.map((activity, index) => {
            const visual = getActivityVisual(activity.title);

            return (
              <div
                key={activity.id}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {index !== activities.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200"></div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${visual.bg} ${visual.color} flex-shrink-0 z-10`}
                >
                  {visual.icon}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>

                  {activity.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-6">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}

      <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing latest {activities.length} activities
        </div>

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition">
          Activity Log
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;
