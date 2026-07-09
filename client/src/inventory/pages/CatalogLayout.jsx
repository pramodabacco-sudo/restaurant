// client/src/inventory/pages/CatalogLayout.jsx
// Groups the 4 master-data screens (Ingredients, Categories, Units,
// Suppliers) under one top-level "Catalog" tab, with a secondary pill-style
// nav to switch between them — one level down from InventoryLayout's main
// tab bar, visually distinguished by the pill shape instead of underline.
import { NavLink, Outlet } from "react-router-dom";

const SUB_TABS = [
  { to: "/inventory/catalog/ingredients", label: "Ingredients" },
  { to: "/inventory/catalog/categories", label: "Categories" },
  { to: "/inventory/catalog/units", label: "Units" },
  { to: "/inventory/catalog/suppliers", label: "Suppliers" },
];

const CatalogLayout = () => {
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

export default CatalogLayout;
