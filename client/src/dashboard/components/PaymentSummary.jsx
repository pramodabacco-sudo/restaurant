// ==============================================
// src/dashboard/components/PaymentSummary.jsx
// ==============================================

import React from "react";
import {
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiPieChart,
  FiTrendingUp,
  FiArrowRight,
  FiRepeat,
  FiFileText,
} from "react-icons/fi";
import { humanizeEnum } from "../utils/format";

// Visual styling keyed by the PaymentMethod enum from schema.prisma
const methodStyles = {
  CASH: {
    color: "bg-green-500",
    icon: <FiDollarSign />,
    bg: "bg-green-100 text-green-600",
  },
  UPI: {
    color: "bg-blue-500",
    icon: <FiSmartphone />,
    bg: "bg-blue-100 text-blue-600",
  },
  CARD: {
    color: "bg-purple-500",
    icon: <FiCreditCard />,
    bg: "bg-purple-100 text-purple-600",
  },
  BANK_TRANSFER: {
    color: "bg-indigo-500",
    icon: <FiRepeat />,
    bg: "bg-indigo-100 text-indigo-600",
  },
  CHEQUE: {
    color: "bg-yellow-500",
    icon: <FiFileText />,
    bg: "bg-yellow-100 text-yellow-600",
  },
  OTHER: {
    color: "bg-gray-500",
    icon: <FiDollarSign />,
    bg: "bg-gray-100 text-gray-600",
  },
};

const PaymentSummary = ({ data, loading = false }) => {
  const { totalAmount = 0, totalTransactions = 0, methods = [] } = data || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Summary</h2>
          <p className="text-gray-500 mt-1">Today's payment collection</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
          <FiPieChart size={28} />
        </div>
      </div>

      {/* Total */}

      <div className="p-6 border-b border-gray-100">
        <p className="text-gray-500 text-sm">Total Collection</p>
        <h2 className="text-4xl font-bold text-gray-800 mt-2">
          {loading ? "—" : `₹${totalAmount.toLocaleString("en-IN")}`}
        </h2>
      </div>

      {/* Payment Methods */}

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            Loading payments...
          </div>
        ) : methods.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No payments recorded today.
          </div>
        ) : (
          methods.map((item) => {
            const style = methodStyles[item.name] || methodStyles.OTHER;

            return (
              <div key={item.name} className="p-5 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${style.bg}`}
                    >
                      {style.icon}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {humanizeEnum(item.name)}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.transactions} Transactions
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <h3 className="font-bold text-lg">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`${style.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary */}

      <div className="grid grid-cols-2 border-t border-gray-100">
        <div className="text-center py-5">
          <p className="text-sm text-gray-500">Transactions</p>
          <h3 className="text-3xl font-bold mt-2">
            {loading ? "—" : totalTransactions}
          </h3>
        </div>

        <div className="text-center py-5 border-l border-gray-100">
          <p className="text-sm text-gray-500">Avg Transaction</p>
          <h3 className="text-3xl font-bold mt-2">
            {loading || totalTransactions === 0
              ? "—"
              : `₹${Math.round(totalAmount / totalTransactions).toLocaleString("en-IN")}`}
          </h3>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
          <FiTrendingUp />
          Live Collection
        </div>

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition font-medium">
          Payment Report
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;
