"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Header() {
  const pathname = usePathname();

  const title = useMemo(() => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    const map: Record<string, string> = {
      dashboard: "Dashboard",
      documents: "Dokumen",
      employees: "Pegawai",
      employee: "Pegawai",
      users: "Pengguna",
      activity: "Aktivitas",
      login: "Login",
    };

    return map[parts[0]] ?? capitalize(parts[0]);
  }, [pathname]);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        borderBottom: "1px solid #ccc",
        gap: "12px",
        flexWrap: "wrap",
        position: "relative",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .header-title {
            padding-left: 44px; /* ruang untuk burger */
          }
        }
      `}</style>

      <div
        className="header-title"
        style={{ fontWeight: 600, fontSize: "clamp(16px, 4vw, 20px)" }}
      >
        {title}
      </div>

      <UserMenu />
    </header>
  );
}
