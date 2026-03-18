"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // SSR-safe client detection (no hydration mismatch, no setState in effect)
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // klik di dalam sidebar -> abaikan
      if (sidebarRef.current?.contains(target)) return;

      // klik di burger -> abaikan (biar toggle di onClick yang handle)
      if (burgerRef.current?.contains(target)) return;

      setIsOpen(false);
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const burgerButton = (
    <button
      ref={burgerRef}
      className="sidebar-hamburger-fixed"
      onClick={() => setIsOpen((v) => !v)}
      aria-label="Toggle menu"
    >
      ☰
    </button>
  );

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <style>{`
        .sidebar-hamburger-fixed {
          position: fixed !important;
          top: 10px !important;
          left: 10px !important;
          z-index: 9999 !important;
          width: 40px;
          height: 40px;
          border: none;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
          cursor: pointer;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-hamburger-fixed { display: block !important; }
          .sidebar {
            position: fixed;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px);
            width: 220px;
            transform: translateX(-100%);
            transition: transform .25s ease;
            z-index: 9998;
          }
          .sidebar.open { transform: translateX(0); }
        }

        @media (min-width: 769px) {
          .sidebar-hamburger-fixed { display: none !important; }
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
          border-bottom: 1px solid rgba(148, 163, 184, 0.22);
        }

        .sidebar-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.98);
          box-shadow: 0 10px 25px rgba(14, 165, 233, .18);
          flex-shrink: 0;
          overflow: hidden;
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
          color: #94a3b8;
        }

        .sidebar-brand-title {
          font-size: 15px;
          font-weight: 700;
          color: #f8fafc;
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
          background: rgba(255,255,255,.08);
          color: #fff;
        }

        .sidebar-link.active {
          background: #0ea5e9;
          color: #fff;
          font-weight: 600;
        }
      `}</style>

      <aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: 240,
          background: "#1e293b",
          color: "#fff",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <Link
          href="/dashboard"
          onClick={() => setIsOpen(false)}
          className="sidebar-brand"
        >
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
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            Dashboard
          </Link>

          <Link
            href="/employee"
            onClick={() => setIsOpen(false)}
            className={`sidebar-link ${isActive("/employee") ? "active" : ""}`}
            aria-current={isActive("/employee") ? "page" : undefined}
          >
            Karyawan
          </Link>

          <Link
            href="/documents"
            onClick={() => setIsOpen(false)}
            className={`sidebar-link ${isActive("/documents") ? "active" : ""}`}
            aria-current={isActive("/documents") ? "page" : undefined}
          >
            Dokumen
          </Link>

          <Link
            href="/activity"
            onClick={() => setIsOpen(false)}
            className={`sidebar-link ${isActive("/activity") ? "active" : ""}`}
            aria-current={isActive("/activity") ? "page" : undefined}
          >
            Aktivitas
          </Link>

          <Link
            href="/users"
            onClick={() => setIsOpen(false)}
            className={`sidebar-link ${isActive("/users") ? "active" : ""}`}
            aria-current={isActive("/users") ? "page" : undefined}
          >
            Pengguna
          </Link>
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 9997,
          }}
        />
      )}

      {isClient ? createPortal(burgerButton, document.body) : null}
    </>
  );
}
