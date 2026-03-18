"use client";

import React, { useEffect, useMemo, useState } from "react";
import ActivityRow from "@/components/activity/ActivityRow";
import { apiFetch } from "@/lib/api";
import { formatActivityDescription } from "@/lib/activity/formatActivity";
import { ToastProvider } from "@/components/ToastProvider";

type Activity = {
  id: string;
  user_id?: string | null;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

type User = {
  id: string;
  username?: string | null;
};

const PAGE_SIZE = 10;

export default function ActivityList({
  activities,
  loading,
  search = "",
}: {
  activities: Activity[];
  loading: boolean;
  search?: string;
}) {
  const [usernameMap, setUsernameMap] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearch] = useState(search);

  React.useEffect(() => {
    setSearch(search);
    setCurrentPage(1);
  }, [search]);

  const userIds = useMemo(
    () =>
      Array.from(
        new Set(
          activities
            .map((a) => a.user_id)
            .filter((v): v is string => typeof v === "string" && v.length > 0),
        ),
      ),
    [activities],
  );

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      if (userIds.length === 0) {
        setUsernameMap({});
        return;
      }

      const entries = await Promise.all(
        userIds.map(async (userId) => {
          try {
            const user = (await apiFetch(`/api/user/${userId}`)) as
              | User
              | { data?: User };

            const username =
              (user as User)?.username ??
              (user as { data?: User })?.data?.username ??
              "";

            return [userId, username || userId] as const;
          } catch {
            return [userId, userId] as const;
          }
        }),
      );

      if (mounted) {
        setUsernameMap(Object.fromEntries(entries));
      }
    }

    loadUsers();
    return () => {
      mounted = false;
    };
  }, [userIds]);

  const filteredActivities = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return activities;

    return activities.filter((a) => {
      const username = (a.user_id ? usernameMap[a.user_id] : a.user_id) ?? "";

      const readableDescription = formatActivityDescription({
        action: a.action,
        description: a.description,
        username: username,
      });

      return (
        username.toLowerCase().includes(q) ||
        (a.action ?? "").toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q) ||
        readableDescription.toLowerCase().includes(q)
      );
    });
  }, [activities, searchInput, usernameMap]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / PAGE_SIZE),
  );

  const adjustedCurrentPage = Math.min(currentPage, totalPages);

  const paginatedActivities = useMemo(() => {
    const start = (adjustedCurrentPage - 1) * PAGE_SIZE;
    return filteredActivities.slice(start, start + PAGE_SIZE);
  }, [filteredActivities, adjustedCurrentPage]);

  return (
    <ToastProvider>
      <style>{`
        .act-shell {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(99,102,241,.06);
        }

        .activity-table-wrapper {
          overflow-x: auto;
        }

        .activity-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 860px;
          font-size: 13.5px;
        }

        .activity-table thead {
          background: linear-gradient(90deg,#eef2ff 0%,#e0e7ff 100%);
          border-bottom: 2px solid #c7d2fe;
        }

        .activity-table th {
          padding: 11px 14px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          color: #4338ca;
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
        }

        .act-row:hover { background: #f5f7ff; }
        .act-td {
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
          color: #1e293b;
        }
        .act-time { color: #64748b; white-space: nowrap; }
        .act-user { color: #312e81; font-weight: 600; white-space: nowrap; }
        .act-action { color: #0f766e; white-space: nowrap; }
        .act-desc {
          color: #334155;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .activity-card-wrapper { display: none; }
        .act-card {
          border-radius: 14px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid #e0e7ff;
          box-shadow: 0 2px 10px rgba(99,102,241,.08);
        }
        .act-card + .act-card { margin-top: 10px; }
        .act-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
        }
        .act-card-item-full { grid-column: 1 / -1; }
        .act-card-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #6366f1;
          margin-bottom: 2px;
        }
        .act-card-value {
          font-size: 13px;
          color: #334155;
          word-break: break-word;
          line-height: 1.45;
        }

        .activity-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-top: 1px solid #e2e8f0;
          padding: 10px 12px;
        }
        .activity-pagination-info {
          font-size: 12px;
          color: #64748b;
        }
        .activity-pagination-info b { color: #312e81; }
        .activity-pagination-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .act-pg-btn {
          border: 1px solid #c7d2fe;
          background: #eef2ff;
          color: #4338ca;
          border-radius: 8px;
          padding: 4px 9px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .act-pg-btn:hover { background: #e0e7ff; }
        .act-pg-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
        }
        .act-pg-btn.active {
          border-color: #4f46e5;
          background: #4f46e5;
          color: #fff;
        }

        @media (max-width: 768px) {
          .activity-table-wrapper { display: none; }
          .activity-card-wrapper { display: block; padding: 10px; }
          .activity-pagination {
            flex-direction: column;
            align-items: stretch;
          }
          .activity-pagination-info { text-align: center; }
          .activity-pagination-buttons { justify-content: center; }
        }

        @media (min-width: 769px) {
          .activity-table-wrapper { display: block; }
          .activity-card-wrapper { display: none; }
        }
      `}</style>

      <div className="act-shell">
        {loading ? (
          <div style={{ padding: 28, textAlign: "center", color: "#64748b" }}>
            Memuat...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div style={{ padding: 18, color: "#64748b" }}>
            {searchInput
              ? `Tidak ada hasil untuk "${searchInput}".`
              : "Tidak ada aktivitas."}
          </div>
        ) : (
          <>
            <div className="activity-table-wrapper">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th style={{ width: 180 }}>Waktu</th>
                    <th style={{ width: 220 }}>User</th>
                    <th style={{ width: 150 }}>Aksi</th>
                    <th>Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map((a) => (
                    <ActivityRow
                      key={a.id}
                      a={a}
                      username={a.user_id ? usernameMap[a.user_id] : undefined}
                      isMobile={false}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="activity-card-wrapper">
              {paginatedActivities.map((a) => (
                <ActivityRow
                  key={a.id}
                  a={a}
                  username={a.user_id ? usernameMap[a.user_id] : undefined}
                  isMobile={true}
                />
              ))}
            </div>

            <div className="activity-pagination">
              <p className="activity-pagination-info">
                Menampilkan <b>{(adjustedCurrentPage - 1) * PAGE_SIZE + 1}</b>–
                <b>
                  {Math.min(
                    adjustedCurrentPage * PAGE_SIZE,
                    filteredActivities.length,
                  )}
                </b>{" "}
                dari <b>{filteredActivities.length}</b> aktivitas
              </p>

              <div className="activity-pagination-buttons">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={adjustedCurrentPage === 1}
                  className="act-pg-btn"
                  title="Halaman Pertama"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={adjustedCurrentPage === 1}
                  className="act-pg-btn"
                  title="Halaman Sebelumnya"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - adjustedCurrentPage) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        style={{
                          padding: "0 6px",
                          color: "#94a3b8",
                          fontSize: 12,
                        }}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`act-pg-btn ${adjustedCurrentPage === p ? "active" : ""}`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={adjustedCurrentPage === totalPages}
                  className="act-pg-btn"
                  title="Halaman Berikutnya"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={adjustedCurrentPage === totalPages}
                  className="act-pg-btn"
                  title="Halaman Terakhir"
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ToastProvider>
  );
}
