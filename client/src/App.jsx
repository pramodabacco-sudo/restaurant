//client\src\App.jsx
import { Routes, Route } from "react-router-dom";
import MenuRoutes from "./menu/menuRoutes";

function App() {
  return (
    <Routes>
      <Route path="/menu/*" element={<MenuRoutes />} />
    </Routes>
  );
}

export default App;