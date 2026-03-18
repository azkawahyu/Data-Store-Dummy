"use client";

import Link from "next/link";
import {
  formatActivityDescription,
  formatActivityTime,
} from "@/lib/activity/formatActivity";

interface Activity {
  id: string;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  username?: string | null;
}

interface Props {
  activities: Activity[];
}

const ACTION_STYLE: Record<string, { bg: string; color: string }> = {
  login: { bg: "#f0fdf4", color: "#16a34a" },
  create_document: { bg: "#eff6ff", color: "#3b82f6" },
  update_document: { bg: "#fefce8", color: "#ca8a04" },
  delete_document: { bg: "#fef2f2", color: "#ef4444" },
  verify_document: { bg: "#f0fdf4", color: "#16a34a" },
  reject_document: { bg: "#fef2f2", color: "#ef4444" },
  create_employee: { bg: "#eff6ff", color: "#3b82f6" },
  update_employee: { bg: "#fefce8", color: "#ca8a04" },
  delete_employee: { bg: "#fef2f2", color: "#ef4444" },
  create_user: { bg: "#f5f3ff", color: "#7c3aed" },
  update_user: { bg: "#fefce8", color: "#ca8a04" },
  delete_user: { bg: "#fef2f2", color: "#ef4444" },
};

function ActionBadge({ action }: { action?: string | null }) {
  const style = ACTION_STYLE[action ?? ""] ?? {
    bg: "#f8fafc",
    color: "#64748b",
  };
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {action ?? "-"}
    </span>
  );
}

export default function DashboardRecentActivity({ activities }: Props) {
  const recent = activities.slice(0, 5);

  return (
    <section
      className="dash-activity-card"
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        background: "white",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .dash-activity-card {
            padding: 12px;
          }

          .dash-activity-item {
            padding: 9px 10px !important;
          }

          .dash-activity-desc {
            font-size: 12px !important;
            line-height: 1.35 !important;
          }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
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
            Aktivitas Terbaru
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            5 aktivitas terakhir di sistem
          </p>
        </div>
        <Link
          href="/activity"
          style={{
            fontSize: 13,
            color: "#6366F1",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Lihat semua →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          Belum ada aktivitas.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((a) => (
            <div
              key={a.id}
              className="dash-activity-item"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: 8,
                borderLeft: "3px solid",
                borderLeftColor:
                  ACTION_STYLE[a.action ?? ""]?.color ?? "#cbd5e1",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                <ActionBadge action={a.action} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  {formatActivityTime(a.created_at)}
                </span>
              </div>
              <p
                className="dash-activity-desc"
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#334155",
                  lineHeight: 1.4,
                }}
              >
                {formatActivityDescription({
                  action: a.action,
                  description: a.description,
                  username: a.username ?? undefined,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
