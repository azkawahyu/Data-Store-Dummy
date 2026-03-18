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

function getActionColor(action?: string | null): string {
  const a = (action ?? "").toLowerCase();

  if (/(create|add|insert|upload|tambah|unggah|buat)/.test(a)) return "#16a34a"; // hijau
  if (/(update|edit|modify|ubah|perbarui)/.test(a)) return "#2563eb"; // biru
  if (/(delete|remove|hapus)/.test(a)) return "#dc2626"; // merah
  if (/(verify|approve|accept|setuju|verifikasi)/.test(a)) return "#15803d"; // hijau tua
  if (/(reject|tolak|decline)/.test(a)) return "#b45309"; // amber
  if (/(login|signin|masuk)/.test(a)) return "#7c3aed"; // ungu
  if (/(logout|signout|keluar)/.test(a)) return "#64748b"; // slate

  return "#0f766e"; // default
}

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

  const actionColor = getActionColor(a.action);

  if (!isMobile) {
    return (
      <tr className="act-row">
        <td className="act-td act-time">{readableTime}</td>
        <td className="act-td act-user">{displayUsername}</td>
        <td
          className="act-td act-action"
          style={{ color: actionColor, fontWeight: 700 }}
        >
          {a.action ?? "-"}
        </td>
        <td className="act-td act-desc">{readableDescription}</td>
      </tr>
    );
  }

  return (
    <div className="act-card">
      <div className="act-card-grid">
        <div className="act-card-item">
          <div className="act-card-label">Waktu</div>
          <div className="act-card-value">{readableTime}</div>
        </div>
        <div className="act-card-item">
          <div className="act-card-label">User</div>
          <div className="act-card-value">{displayUsername}</div>
        </div>
        <div className="act-card-item">
          <div className="act-card-label">Aksi</div>
          <div
            className="act-card-value"
            style={{ color: actionColor, fontWeight: 700 }}
          >
            {a.action ?? "-"}
          </div>
        </div>
        <div className="act-card-item act-card-item-full">
          <div className="act-card-label">Deskripsi</div>
          <div className="act-card-value">{readableDescription}</div>
        </div>
      </div>
    </div>
  );
}
