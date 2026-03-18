"use client";

import StatisticsPieCharts from "@/components/dashboard/StatisticsPieCharts";
import DashboardTrend from "@/components/dashboard/DashboardTrend";
import DashboardTopEmployees from "@/components/dashboard/DashboardTopEmployees";
import DashboardPendingTable from "@/components/dashboard/DashboardPendingTable";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";

type Employee = {
  id: string;
  unit: string | null;
};

type Document = {
  id: string;
  document_type: string;
  status: string;
  file_name?: string;
  employee_name?: string | null;
  uploaded_at?: string | null;
};

type Activity = {
  id: string;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  username?: string | null;
};

type Role = "admin" | "employee" | "hr";

interface Props {
  role: Role;
  employees: Employee[];
  documents: Document[];
  activities: Activity[];
}

export default function RoleDashboard({
  role,
  employees,
  documents,
  activities,
}: Props) {
  const pendingDocs = documents.filter((d) => d.status === "pending");

  return (
    <div className="dash-root" style={{ display: "grid", gap: 16 }}>
      <style>{`
        .dash-root {
          display: grid;
          gap: 16px;
        }

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

        .dash-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .dash-two-col {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dash-root {
            gap: 12px;
          }

          .dash-welcome {
            padding: 12px;
            border-radius: 12px;
          }
        }
      `}</style>

      <section className="dash-welcome">
        <h2 className="dash-welcome-title">
          Selamat datang, {role.toUpperCase()}
        </h2>
      </section>

      <StatisticsPieCharts employees={employees} documents={documents} />

      <div className="dash-two-col">
        <DashboardTrend documents={documents} />
        <DashboardTopEmployees documents={documents} />
      </div>

      <div className="dash-two-col">
        <DashboardPendingTable documents={pendingDocs} />
        <DashboardRecentActivity activities={activities} />
      </div>
    </div>
  );
}
