"use client";

import React from "react";
import {
  formatActivityDescription,
  formatActivityTime,
} from "@/lib/activity/formatActivity";

type Activity = {
  id: string;
  user_id?: string | null;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

type ActivityRowProps = {
  a: Activity;
  username?: string;
  isMobile?: boolean;
};

export default function ActivityRow({
  a,
  username,
  isMobile = false,
}: ActivityRowProps) {
  const displayUsername = username ?? a.user_id ?? "-";
  const readableTime = formatActivityTime(a.created_at);
  const readableDescription = formatActivityDescription({
    action: a.action,
    description: a.description,
    username: displayUsername,
  });

  // Desktop View - Table Row
  if (!isMobile) {
    return (
      <tr className="hover:bg-slate-50/70 align-top">
        <td className="py-3 px-4 whitespace-nowrap text-slate-600">
          {readableTime}
        </td>
        <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
          {displayUsername}
        </td>
        <td className="py-3 px-4 whitespace-nowrap text-slate-700">
          {a.action ?? "-"}
        </td>
        <td className="py-3 px-4 text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
          {readableDescription}
        </td>
      </tr>
    );
  }

  // Mobile View - Card Style
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr",
        gap: "8px",
        padding: "12px",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "11px",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          Waktu
        </div>
        <div
          style={{
            color: "#334155",
            fontSize: "13px",
            wordBreak: "break-word",
          }}
        >
          {readableTime}
        </div>
      </div>
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "11px",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          User
        </div>
        <div
          style={{
            color: "#334155",
            fontSize: "13px",
            wordBreak: "break-word",
          }}
        >
          {displayUsername}
        </div>
      </div>
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "11px",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          Aksi
        </div>
        <div
          style={{
            color: "#334155",
            fontSize: "13px",
            wordBreak: "break-word",
          }}
        >
          {a.action ?? "-"}
        </div>
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "11px",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          Deskripsi
        </div>
        <div
          style={{
            color: "#334155",
            fontSize: "13px",
            wordBreak: "break-word",
          }}
        >
          {readableDescription}
        </div>
      </div>
    </div>
  );
}
