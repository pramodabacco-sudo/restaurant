//client\src\App.jsx
import { Routes, Route } from "react-router-dom";
import MenuRoutes from "./menu/menuRoutes";
import PosRoutes from "./pos/posRoutes";
import SettingsRoutes from "./settings/settingsRoutes";
function App() {
  return (
    <Routes>
      <Route path="/menu/*" element={<MenuRoutes />} />
      <Route path="/pos/*" element={<PosRoutes />} />
      <Route path="/settings/*" element={<SettingsRoutes />} />
    </Routes>
  );
}

export default App;