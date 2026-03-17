"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import EmployeeList from "@/components/dashboard/EmployeeList";

type Employee = {
  id: number;
  nama: string;
  jabatan: string;
};

type Role = "admin" | "employee" | "hr";

interface Props {
  role: Role;
  employees: Employee[];
  documentCount: number;
}

export default function RoleDashboard({
  role,
  employees,
  documentCount,
}: Props) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <style>{`
        .dash-welcome {
          border: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          border-radius: 14px;
          padding: 16px;
        }

        .dash-welcome-title {
          margin: 6px 0 0;
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 700;
          word-break: break-word;
        }
      `}</style>

      <section className="dash-welcome">
        <h2 className="dash-welcome-title">
          Selamat datang, {role.toUpperCase()}
        </h2>
      </section>

      {(role === "admin" || role === "hr") && (
        <>
          <DashboardStats
            employeeCount={employees.length}
            documentCount={documentCount}
          />
          <EmployeeList employees={employees} />
        </>
      )}

      {role === "employee" && (
        <>
          <DashboardStats employeeCount={0} documentCount={documentCount} />
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 16,
              background: "#fff",
              wordBreak: "break-word",
            }}
          >
            Fokus Anda: upload dan melihat dokumen Anda sendiri.
          </div>
        </>
      )}
    </div>
  );
}
