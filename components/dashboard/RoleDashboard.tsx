"use client";

import StatisticsPieCharts from "@/components/dashboard/StatisticsPieCharts";
import DashboardTrend from "@/components/dashboard/DashboardTrend";
import DashboardTopEmployees from "@/components/dashboard/DashboardTopEmployees";
import DashboardPendingTable from "@/components/dashboard/DashboardPendingTable";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";
import DashboardStats from "@/components/dashboard/DashboardStats";
import EmployeeProfileDashboard from "@/components/dashboard/EmployeeProfileDashboard";
import {
  DOCUMENT_STATUS,
  formatDocumentStatusLabel,
  getDocumentStatusTone,
  normalizeDocumentStatus,
} from "@/components/documents/status";
import { getRoleLabel } from "@/components/common/labels";

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

type EmployeeProfile = {
  id: string;
  nip?: string | null;
  nama?: string | null;
  jabatan?: string | null;
  unit?: string | null;
  status?: string | null;
  email?: string | null;
  no_hp?: string | null;
};

type UserProfile = {
  id: string;
  username?: string | null;
  nip?: string | null;
  email?: string | null;
  employee_id: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
};

type Role = "admin" | "employee" | "hr";

interface Props {
  role: Role;
  employees: Employee[];
  documents: Document[];
  activities: Activity[];
  employeeProfile?: EmployeeProfile | null;
  userProfile?: UserProfile | null;
  onUploadDocument?: () => void;
}

export default function RoleDashboard({
  role,
  employees,
  documents,
  activities,
  employeeProfile,
  userProfile,
  onUploadDocument,
}: Props) {
  const pendingDocs = documents.filter(
    (d) => normalizeDocumentStatus(d.status) === DOCUMENT_STATUS.PENDING,
  );
  const verifiedDocs = documents.filter(
    (d) => normalizeDocumentStatus(d.status) === DOCUMENT_STATUS.VERIFIED,
  ).length;
  const roleLabel = getRoleLabel(role);
  const recentDocuments = documents.slice(0, 5);

  const getStatusLabel = (status: string) => {
    return formatDocumentStatusLabel(status);
  };

  if (role === "employee") {
    return (
      <EmployeeProfileDashboard
        accountProfile={userProfile ?? null}
        profile={employeeProfile ?? null}
        documents={documents}
        onUpload={onUploadDocument ?? (() => {})}
      />
    );
  }

  return (
    <div className="dash-root" style={{ display: "grid", gap: 16 }}>
      <style>{`
        .dash-root {
          display: grid;
          gap: 16px;
        }

        .dash-welcome {
          position: relative;
          overflow: hidden;
          border: 1px solid #cffafe;
          background: linear-gradient(90deg, #ecfeff 0%, #eff6ff 52%, #eef2ff 100%);
          color: #0f172a;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(79,70,229,.08);
        }

        .dash-welcome::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(99,102,241,.16), transparent 32%),
            radial-gradient(circle at left center, rgba(6,182,212,.14), transparent 30%);
          pointer-events: none;
        }

        .dash-welcome::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: linear-gradient(to bottom right, rgba(0,0,0,.28), transparent 65%);
          pointer-events: none;
        }

        .dash-welcome-head {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .dash-welcome-copy {
          min-width: 0;
        }

        .dash-welcome-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 24px;
          background: linear-gradient(135deg, rgba(6,182,212,.16) 0%, rgba(99,102,241,.16) 100%);
          border: 1px solid rgba(255,255,255,.8);
          box-shadow: 0 8px 18px rgba(79,70,229,.08);
          backdrop-filter: blur(8px);
        }

        .dash-welcome-title {
          margin: 6px 0 0;
          font-size: clamp(22px, 3.8vw, 30px);
          font-weight: 800;
          letter-spacing: -.03em;
          word-break: break-word;
          color: #1e293b;
        }

        .dash-welcome-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.9);
          color: #0891b2;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(6,182,212,.08);
        }

        .dash-welcome-desc {
          margin: 8px 0 0;
          font-size: 14px;
          color: #475569;
          max-width: 700px;
          line-height: 1.6;
        }

        .dash-welcome-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .dash-meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow: 0 6px 16px rgba(15,23,42,.05);
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }

        .dash-meta-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .dash-meta-dot.cyan { background: #06b6d4; }
        .dash-meta-dot.indigo { background: #6366f1; }
        .dash-meta-dot.emerald { background: #10b981; }

        .dash-highlight-row {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .dash-highlight-card {
          border-radius: 14px;
          padding: 14px 16px;
          border: 1px solid rgba(255,255,255,.75);
          background: rgba(255,255,255,.86);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dash-highlight-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .dash-highlight-icon.pending {
          background: #eff6ff;
          color: #2563eb;
        }

        .dash-highlight-icon.verified {
          background: #ecfdf5;
          color: #059669;
        }

        .dash-highlight-copy {
          min-width: 0;
        }

        .dash-highlight-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #64748b;
        }

        .dash-highlight-value {
          margin-top: 6px;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
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
            padding: 14px;
            border-radius: 12px;
          }

          .dash-welcome-head {
            flex-direction: column;
          }
        }
      `}</style>

      <section className="dash-welcome">
        <div className="dash-welcome-head">
          <div className="dash-welcome-copy">
            <span className="dash-welcome-kicker">Dashboard Ringkasan</span>
            <h2 className="dash-welcome-title">Selamat datang, {roleLabel}</h2>
            <p className="dash-welcome-desc">
              Pantau aktivitas dokumen, performa pengunggahan, dan ringkasan
              data pegawai dalam satu tampilan yang lebih nyaman dibaca.
            </p>
            <div className="dash-welcome-meta">
              <span className="dash-meta-chip">
                <span className="dash-meta-dot cyan" aria-hidden />
                Monitoring dokumen real-time
              </span>
              <span className="dash-meta-chip">
                <span className="dash-meta-dot indigo" aria-hidden />
                Statistik pegawai & unit
              </span>
              <span className="dash-meta-chip">
                <span className="dash-meta-dot emerald" aria-hidden />
                {role === "hr"
                  ? "Dokumen terbaru untuk diproses"
                  : "Aktivitas terbaru sistem"}
              </span>
            </div>
          </div>
          <span className="dash-welcome-icon" aria-hidden>
            ✨
          </span>
        </div>

        <div className="dash-highlight-row">
          <div className="dash-highlight-card">
            <span className="dash-highlight-icon pending" aria-hidden>
              ⏳
            </span>
            <div className="dash-highlight-copy">
              <div className="dash-highlight-label">
                Dokumen Menunggu Verifikasi
              </div>
              <div className="dash-highlight-value">{pendingDocs.length}</div>
            </div>
          </div>
          <div className="dash-highlight-card">
            <span className="dash-highlight-icon verified" aria-hidden>
              ✔
            </span>
            <div className="dash-highlight-copy">
              <div className="dash-highlight-label">Dokumen Terverifikasi</div>
              <div className="dash-highlight-value">{verifiedDocs}</div>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats
        employeeCount={employees.length}
        documentCount={documents.length}
      />

      <StatisticsPieCharts employees={employees} documents={documents} />

      <div className="dash-two-col">
        <DashboardTrend documents={documents} />
        <DashboardTopEmployees documents={documents} />
      </div>

      <div className="dash-two-col">
        <DashboardPendingTable documents={pendingDocs} />
        {role === "hr" ? (
          <section
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 16,
              background: "rgba(255,255,255,.92)",
              boxShadow: "0 8px 22px rgba(15,23,42,.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Dokumen Terbaru
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  5 dokumen terakhir untuk pemantauan verifikasi
                </p>
              </div>
            </div>

            {recentDocuments.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                Belum ada dokumen.
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      background: "#f8fbff",
                      borderRadius: 12,
                      borderLeft: "3px solid #60a5fa",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#334155",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {doc.file_name || doc.document_type}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        {doc.employee_name || "-"}
                      </p>
                    </div>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                        background: getDocumentStatusTone(doc.status).bg,
                        color: getDocumentStatusTone(doc.status).color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <DashboardRecentActivity activities={activities} />
        )}
      </div>
    </div>
  );
}
