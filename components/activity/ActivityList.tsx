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

const PAGE_SIZE = 15;

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
  const [isMobile, setIsMobile] = useState(false);

  // Initialize isMobile state
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Reset currentPage when search prop changes
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

  const totalPages = Math.ceil(filteredActivities.length / PAGE_SIZE);

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredActivities.slice(start, start + PAGE_SIZE);
  }, [filteredActivities, currentPage]);

  return (
    <ToastProvider>
      <style>{`
        @media (max-width: 768px) {
          .activity-table-wrapper {
            display: none !important;
          }
          .activity-card-wrapper {
            display: block !important;
          }
          .activity-pagination {
            flex-direction: column;
            gap: 12px;
          }
          .activity-pagination-info {
            font-size: 12px;
            text-align: center;
          }
          .activity-pagination-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
        @media (min-width: 769px) {
          .activity-table-wrapper {
            display: block !important;
          }
          .activity-card-wrapper {
            display: none !important;
          }
          .activity-pagination {
            flex-direction: row;
          }
          .activity-pagination-info {
            text-align: left;
          }
          .activity-pagination-buttons {
            justify-content: flex-end;
          }
        }
      `}</style>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            Memuat...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-6 text-slate-500 text-sm sm:text-base">
            {searchInput
              ? `Tidak ada hasil untuk "${searchInput}".`
              : "Tidak ada aktivitas."}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="activity-table-wrapper overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <th className="py-3 px-4 w-44">Waktu</th>
                    <th className="py-3 px-4 w-52">User</th>
                    <th className="py-3 px-4 w-40">Aksi</th>
                    <th className="py-3 px-4 min-w-[320px]">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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

            {/* Mobile Card View */}
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

            {/* Pagination */}
            <div className="activity-pagination flex items-center justify-between px-4 py-3 border-t border-slate-200 gap-4">
              <p className="activity-pagination-info text-xs text-slate-500">
                Menampilkan{" "}
                <span className="font-medium text-slate-700">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredActivities.length)}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-slate-700">
                  {filteredActivities.length}
                </span>{" "}
                aktivitas
              </p>

              <div className="activity-pagination-buttons flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  title="Halaman Pertama"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  title="Halaman Sebelumnya"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-2 text-slate-400 text-xs"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-2.5 py-1 text-xs rounded border ${
                          currentPage === p
                            ? "bg-slate-800 text-white border-slate-800"
                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  title="Halaman Berikutnya"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
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
