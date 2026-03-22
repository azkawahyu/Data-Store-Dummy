"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

type UserRole = "admin" | "hr" | "employee";

function getRoleFromToken(): UserRole | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { role?: string };
    const role = String(payload.role ?? "").toLowerCase();
    if (role === "admin" || role === "hr" || role === "employee") {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const { isOpen, close } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // klik di dalam sidebar -> abaikan
      if (sidebarRef.current?.contains(target)) return;

      close();
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    const syncRole = () => setRole(getRoleFromToken());
    syncRole();

    window.addEventListener("storage", syncRole);
    return () => window.removeEventListener("storage", syncRole);
  }, []);

  const navItems = useMemo(() => {
    if (role === "admin") {
      return [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/employee", label: "Karyawan" },
        { href: "/documents", label: "Dokumen" },
        { href: "/activity", label: "Aktivitas" },
        { href: "/users", label: "Pengguna" },
      ];
    }

    if (role === "hr") {
      return [
        // { href: "/hr", label: "Admin Umum" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/employee", label: "Karyawan" },
        { href: "/documents", label: "Dokumen" },
      ];
    }

    return [{ href: "/dashboard", label: "Dashboard" }];
  }, [role]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 220px;
            transform: translateX(-100%);
            transition: transform .25s ease;
            z-index: 9998;
          }
          .sidebar.open { transform: translateX(0); }
        }

        @media (min-width: 769px) {
          .sidebar {
            position: sticky;
            top: 0;
            height: 100vh;
            transform: none;
            z-index: auto;
            flex-shrink: 0;
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .sidebar-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to bottom right, #bfdbfe, #dbeafe);
          box-shadow: 0 0 0 1px #bfdbfe;
          flex-shrink: 0;
          overflow: hidden;
          border: none;
        }

        .sidebar-brand-label {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-brand-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: #ffffff;
        }

        .sidebar-brand-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-link {
          color: #e2e8f0;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 8px;
          transition: background .2s ease, color .2s ease;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        .sidebar-link.active {
          background: rgba(59, 130, 246, 0.25);
          color: #fff;
          font-weight: 600;
          border-left: 3px solid #60a5fa;
          padding-left: 7px;
        }
      `}</style>

      <aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: 240,
          background: "linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)",
          color: "#fff",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <Link href="/dashboard" onClick={close} className="sidebar-brand">
          <span className="sidebar-brand-mark">
            <Image
              src="/logo/TVRI_JAKARTA_2023.svg"
              alt="TVRI DKI Jakarta"
              width={34}
              height={34}
              className="h-8.5 w-8.5 object-contain"
              priority
            />
          </span>
          <span className="sidebar-brand-label">
            <span className="sidebar-brand-eyebrow">TVRI DKI JAKARTA</span>
            <span className="sidebar-brand-title">SmartStaff</span>
          </span>
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 9997,
          }}
        />
      )}
    </>
  );
}
