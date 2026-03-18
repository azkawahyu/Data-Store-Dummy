"use client";

import type { UsersStats } from "./types";

const CARDS = [
  {
    key: "total",
    label: "Total User",
    tone: "border-indigo-200 bg-linear-to-r from-indigo-50 via-violet-50 to-indigo-100 text-indigo-700",
  },
  {
    key: "admin",
    label: "Admin",
    tone: "border-violet-200 bg-linear-to-r from-violet-50 via-purple-50 to-violet-100 text-violet-700",
  },
  {
    key: "hr",
    label: "HR",
    tone: "border-sky-200 bg-linear-to-r from-sky-50 via-cyan-50 to-sky-100 text-sky-700",
  },
  {
    key: "employee",
    label: "Employee",
    tone: "border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-100 text-emerald-700",
  },
  {
    key: "unlinked",
    label: "Belum Terkait",
    tone: "border-amber-200 bg-linear-to-r from-amber-50 via-orange-50 to-amber-100 text-amber-700",
  },
  {
    key: "conflict",
    label: "Perlu Tindakan",
    tone: "border-rose-200 bg-linear-to-r from-rose-50 via-red-50 to-rose-100 text-rose-700",
  },
] as const;

export default function UserStats({ stats }: { stats: UsersStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {CARDS.map((c) => (
        <div key={c.key} className={`rounded-xl border px-4 py-3 ${c.tone}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90">
            {c.label}
          </p>
          <p className="mt-1 text-2xl font-extrabold">
            {stats[c.key as keyof UsersStats] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
