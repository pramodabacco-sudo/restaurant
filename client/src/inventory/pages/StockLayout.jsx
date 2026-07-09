// client/src/inventory/pages/StockLayout.jsx
// Groups the 4 stock-movement screens (Ledger, Adjustments, Wastage, Expiry
// Batches) under one top-level "Stock" tab, same pattern as CatalogLayout.
import { NavLink, Outlet } from "react-router-dom";

const SUB_TABS = [
  { to: "/inventory/stock/ledger", label: "Stock Ledger" },
  { to: "/inventory/stock/adjustments", label: "Adjustments" },
  { to: "/inventory/stock/wastage", label: "Wastage" },
  { to: "/inventory/stock/expiry", label: "Expiry Batches" },
];

const StockLayout = () => {
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {SUB_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-sm transition-colors ${
                isActive
                  ? "bg-[var(--inv-pine)] text-white font-medium"
                  : "bg-[var(--inv-steel-light)] text-[var(--inv-steel)] hover:text-[var(--inv-ink)]"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default StockLayout;
