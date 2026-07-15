// ==============================================
// src/dashboard/components/SalesChart.jsx
// ==============================================

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FiTrendingUp, FiCalendar } from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";
import { formatCurrency } from "../utils/format";

// ==========================================
// THEME-AWARE CHART TOKENS
// (Recharts needs real color strings, not Tailwind classes)
// ==========================================

const chartTokens = {
  light: {
    accent: "#3FA34D",
    grid: "#EFF2E9",
    axis: "#E7EAE1",
    tick: "#6B7280",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#E7EAE1",
    tooltipLabel: "#1F2937",
  },
  dark: {
    accent: "#43B75A",
    grid: "#262B24",
    axis: "#262B24",
    tick: "#9CA8A0",
    tooltipBg: "#171C17",
    tooltipBorder: "#262B24",
    tooltipLabel: "#FFFFFF",
  },
};

const SalesChart = ({
  data = [],
  period = "daily",
  onPeriodChange,
  loading = false,
}) => {
  const { theme } = useTheme();

  const tokens = chartTokens[theme] || chartTokens.light;

  const totalSales = useMemo(
    () => data.reduce((sum, item) => sum + item.sales, 0),
    [data],
  );
  const averageSales = data.length ? Math.round(totalSales / data.length) : 0;

  // Simple growth signal: last bucket vs first bucket in the current window.
  const growth = useMemo(() => {
    if (data.length < 2) return null;
    const first = data[0].sales;
    const last = data[data.length - 1].sales;
    if (first === 0) return null;
    return (((last - first) / first) * 100).toFixed(1);
  }, [data]);

  return (
    <div className="bg-white dark:bg-[#171C17] rounded-2xl border border-[#E7EAE1] dark:border-[#262B24] shadow-sm shadow-black/[0.02] dark:shadow-none transition-colors">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-[#E7EAE1] dark:border-[#262B24]">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white">
            Sales Overview
          </h2>

          <p className="text-[#6B7280] dark:text-[#9CA8A0] mt-1">
            Revenue analytics and sales performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["daily", "weekly", "monthly"].map((item) => (
            <button
              key={item}
              onClick={() => onPeriodChange && onPeriodChange(item)}
              className={`px-4 py-2 rounded-full capitalize transition-all ${
                period === item
                  ? "bg-[#3FA34D] dark:bg-[#43B75A] text-white"
                  : "bg-[#F3F5EE] dark:bg-[#232A22] hover:bg-[#E7EAE1] dark:hover:bg-[#2A322A] text-[#6B7280] dark:text-[#9CA8A0]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-5 border-b border-[#E7EAE1] dark:border-[#262B24]">
        <div>
          <p className="text-[#6B7280] dark:text-[#9CA8A0] text-sm">
            Total Sales
          </p>

          <h3 className="text-3xl font-bold mt-2 text-[#1F2937] dark:text-white">
            {loading ? "—" : formatCurrency(totalSales)}
          </h3>
        </div>

        <div>
          <p className="text-[#6B7280] dark:text-[#9CA8A0] text-sm">Average</p>

          <h3 className="text-3xl font-bold mt-2 text-[#1F2937] dark:text-white">
            {loading ? "—" : formatCurrency(averageSales)}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#3FA34D]/10 dark:bg-[#43B75A]/10 flex items-center justify-center text-[#3FA34D] dark:text-[#43B75A]">
            <FiTrendingUp size={26} />
          </div>

          <div>
            <p className="text-[#6B7280] dark:text-[#9CA8A0] text-sm">Growth</p>

            <h3 className="text-2xl font-bold text-[#3FA34D] dark:text-[#43B75A]">
              {loading || growth === null
                ? "—"
                : `${growth >= 0 ? "+" : ""}${growth}%`}
            </h3>
          </div>
        </div>
      </div>

      {/* Chart */}

      <div className="h-[420px] p-6">
        {!loading && data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#9CA3AF] dark:text-[#6B7280]">
            No sales recorded for this period yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={tokens.accent}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={tokens.accent}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={tokens.grid} />

              <XAxis
                dataKey="name"
                tick={{ fill: tokens.tick }}
                axisLine={{ stroke: tokens.axis }}
              />

              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                tick={{ fill: tokens.tick }}
                axisLine={{ stroke: tokens.axis }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: tokens.tooltipBg,
                  border: `1px solid ${tokens.tooltipBorder}`,
                  borderRadius: "0.75rem",
                }}
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ color: tokens.tooltipLabel }}
                itemStyle={{ color: tokens.accent }}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke={tokens.accent}
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#E7EAE1] dark:border-[#262B24] px-6 py-5">
        <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#9CA8A0]">
          <FiCalendar className="text-[#3FA34D] dark:text-[#43B75A]" />
          Updated just now
        </div>

        {growth !== null && (
          <div
            className={`text-sm font-semibold ${
              growth >= 0
                ? "text-[#3FA34D] dark:text-[#43B75A]"
                : "text-[#EF5350]"
            }`}
          >
            {growth >= 0
              ? "Revenue is increasing compared to the start of this period."
              : "Revenue has dipped compared to the start of this period."}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
