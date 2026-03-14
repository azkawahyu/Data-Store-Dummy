"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import DashboardStats from "@/components/dashboard/DashboardStats";
import EmployeeList from "@/components/dashboard/EmployeeList";
import LogoutButton from "@/components/dashboard/LogoutButton";

// Define an Employee type based on expected data structure
type Employee = {
  id: number;
  nama: string;
  jabatan: string;
};
type Document = {
  id: number;
  title: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documentCount, setDocumentCount] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const dataEmployee = await apiFetch("/api/employees");
        setEmployees(dataEmployee);

        const dataDocument = await apiFetch("/api/documents");
        setDocumentCount(dataDocument);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <DashboardStats
        employeeCount={employees.length}
        documentCount={documentCount.length}
      />

      <EmployeeList employees={employees} />
    </div>
  );
}
