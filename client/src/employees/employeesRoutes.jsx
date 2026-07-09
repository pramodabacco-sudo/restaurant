// ==============================================
// client/src/employees/employeesRoutes.jsx
// ==============================================

import React from "react";
import { Routes, Route } from "react-router-dom";

import EmployeesList from "./EmployeesList";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";

const EmployeesRoutes = () => {
  return (
    <Routes>
      {/* /employees */}
      <Route index element={<EmployeesList />} />

      {/* /employees/new */}
      <Route path="new" element={<EmployeeForm />} />

      {/* /employees/:id */}
      <Route path=":id" element={<EmployeeDetails />} />

      {/* /employees/:id/edit */}
      <Route path=":id/edit" element={<EmployeeForm />} />
    </Routes>
  );
};

export default EmployeesRoutes;
