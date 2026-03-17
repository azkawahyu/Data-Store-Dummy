"use client";

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
            position: relative;
            top: 0;
            height: auto;
            transform: none;
            z-index: auto;
          }
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
          width: 220,
          background: "#1e293b",
          color: "#fff",
          padding: 20,
          overflowY: "auto",
        }}
      >
        <h2
          style={{ marginBottom: "30px", fontSize: "clamp(16px, 4vw, 24px)" }}
        ></h2>

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
