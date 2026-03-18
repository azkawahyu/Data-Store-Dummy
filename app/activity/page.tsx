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
    <div className="page-shell">
      <style>{`
        .activity-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .activity-search-input {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 14px;
          color: #334155;
          min-width: 260px;
          outline: none;
        }
        .activity-search-input:focus {
          border-color: #94a3b8;
          box-shadow: 0 0 0 2px rgba(148,163,184,.2);
        }

        .activity-refresh-btn {
          border: 1px solid #0f172a;
          background: #0f172a;
          color: #fff;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .activity-refresh-btn:hover {
          background: #1e293b;
        }

        @media (max-width: 768px) {
          .activity-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .activity-search-input {
            min-width: 0;
            width: 100%;
          }
          .activity-refresh-btn {
            width: 100%;
          }
        }
      `}</style>

      <header className="page-header">
        <div>
          <h1 className="page-title">Log Aktivitas</h1>
          <p className="page-subtitle">Riwayat aktivitas sistem</p>
        </div>

        <div className="activity-actions">
          <input
            type="text"
            placeholder="Cari user, aksi, dan deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="activity-search-input"
          />
          <button
            onClick={() => {
              setLoading(true);
              load();
            }}
            className="activity-refresh-btn"
          >
            Refresh
          </button>
        </div>
      </header>

      <div className="page-panel" style={{ padding: 12 }}>
        <ActivityList
          activities={activities}
          loading={loading}
          search={search}
        />
      </div>
    </div>
  );
}
