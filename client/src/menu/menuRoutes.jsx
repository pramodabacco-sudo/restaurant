//client\src\menu\menuRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MenuList from "./pages/MenuList";
import Categories from "./pages/Categories";

const MenuRoutes = () => {
  return (
    <Routes>
      <Route index element={<MenuList />} />
      <Route path="categories" element={<Categories />} />
    </Routes>
  );
};

export default MenuRoutes;