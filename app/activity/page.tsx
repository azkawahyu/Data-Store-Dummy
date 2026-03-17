"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ActivityList from "@/components/activity/ActivityList";

interface Activity {
  id: string;
  created_at: string;
  user_id: string;
  action: string;
  description: string;
  [key: string]: unknown;
}

export default function ActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await apiFetch("/api/activity");
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setActivities(list);
    } catch (e) {
      console.error(e);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="w-full p-4 sm:p-6">
      <style>{`
        @media (max-width: 640px) {
          .activity-header {
            flex-direction: column;
            gap: 16px !important;
          }
          .activity-search-group {
            flex-direction: column;
            width: 100% !important;
          }
          .activity-search-input {
            width: 100% !important;
          }
          .activity-refresh-btn {
            width: 100%;
          }
        }
      `}</style>

      <header className="activity-header flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Log Aktivitas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Riwayat aktivitas sistem
          </p>
        </div>

        <div className="activity-search-group flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari user, aksi, dan deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="activity-search-input border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 w-64"
          />
          <button
            onClick={() => {
              setLoading(true);
              load();
            }}
            className="activity-refresh-btn bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
          >
            Refresh
          </button>
        </div>
      </header>

      <ActivityList activities={activities} loading={loading} search={search} />
    </div>
  );
}
