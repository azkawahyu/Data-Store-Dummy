"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import ActivityList from "@/components/activity/ActivityList";
import ActivityTableFilters from "@/components/activity/ActivityTableFilters";

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
      <div className="header-card">
        <header className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">Log Aktivitas</h1>
            <p className="page-subtitle">Riwayat aktivitas sistem</p>
          </div>
        </header>
      </div>

      <div className="card">
        <ActivityTableFilters
          search={search}
          loading={loading}
          onSearchChange={setSearch}
          onRefresh={() => {
            setLoading(true);
            load();
          }}
        />

        <ActivityList
          activities={activities}
          loading={loading}
          search={search}
        />
      </div>
    </div>
  );
}
