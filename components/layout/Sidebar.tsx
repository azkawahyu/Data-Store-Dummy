"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}></h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link href="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>

        <Link href="/employees" style={{ color: "white" }}>
          Pegawai
        </Link>

        <Link href="/documents" style={{ color: "white" }}>
          Dokumen
        </Link>

        <Link href="/users" style={{ color: "white" }}>
          Pengguna
        </Link>
      </nav>
    </aside>
  );
}
