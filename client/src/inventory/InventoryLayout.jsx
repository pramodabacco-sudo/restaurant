// client/src/inventory/InventoryLayout.jsx
// Top-level sub-nav for the inventory section (sits inside AdminLayout's
// content area — no sidebar of its own, since AdminLayout already has one).
// Reduced from 13 flat tabs down to 6 groups: related screens (Ingredients/
// Categories/Units/Suppliers, and Stock Ledger/Adjustments/Wastage/Expiry)
// are combined behind their own secondary tab bar — see CatalogLayout.jsx
// and StockLayout.jsx.
import { NavLink, Outlet } from "react-router-dom";
import "./theme.css";

const TABS = [
  { to: "/inventory", label: "Dashboard", end: true },
  { to: "/inventory/alerts", label: "Alerts" },
  { to: "/inventory/catalog", label: "Catalog" },
  { to: "/inventory/purchase-entries", label: "Purchase Entries" },
  { to: "/inventory/stock", label: "Stock" },
  { to: "/inventory/recipes", label: "Recipes" },
];

const InventoryLayout = () => {
  return (
    <div className="inv-scope">
      <nav className="mb-6 border-b border-[var(--inv-line)] overflow-x-auto">
        <ul className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `inline-block px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    isActive
                      ? "border-[var(--inv-pine)] text-[var(--inv-pine-dark)] font-medium"
                      : "border-transparent text-[var(--inv-steel)] hover:text-[var(--inv-ink)]"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default InventoryLayout;
