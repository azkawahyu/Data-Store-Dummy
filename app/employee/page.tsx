"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Employee = {
  id: string | number;
  name: string;
  role: string;
  jabatan: string;
};

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadEmployees() {
      const data = await apiFetch("/api/employees");
      setEmployees(data);
    }

    loadEmployees();
  }, []);

  return (
    <div>
      <h1>Employees</h1>

      {employees.map((emp: Employee) => (
        <div key={emp.id}>{emp.name}</div>
      ))}
    </div>
  );
}
