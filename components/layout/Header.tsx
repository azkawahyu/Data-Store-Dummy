"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useSidebar } from "./SidebarContext";

function getRoleFromToken() {
  try {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { role?: string };
    return (payload.role ?? "").toLowerCase();
  } catch {
    return null;
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return getRoleFromToken();
}

function getServerSnapshot() {
  return null;
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function HeaderLogo() {
  return (
    <Link
      href="/dashboard"
      aria-label="Logo aplikasi"
      className="group inline-flex items-center gap-3 rounded-xl border border-blue-300/50 bg-white/90 backdrop-blur-sm px-3 py-2 shadow-md transition hover:border-blue-400/70 hover:shadow-lg"
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-100 to-sky-100 shadow-sm ring-1 ring-blue-200">
        <Image
          src="/logo/TVRI_JAKARTA_2023.svg"
          alt="TVRI DKI Jakarta"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </span>
      <span className="flex flex-col text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-800">
          TVRI DKI JAKARTA
        </span>
        <span className="text-sm font-semibold text-slate-800 transition group-hover:text-slate-900">
          SmartStaff
        </span>
      </span>
    </Link>
  );
}

export default function Header({
  showSidebarToggle = true,
}: {
  showSidebarToggle?: boolean;
}) {
  const pathname = usePathname();
  const { toggle } = useSidebar();
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const showHeaderTitle = role === "employee";

  const title = useMemo(() => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    if (parts[0] === "profile") {
      return parts[1] === "employee" ? "Data Pegawai" : "Profil Akun";
    }

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
    <header className="z-20 border-b border-blue-200/50 bg-linear-to-r from-blue-100 via-blue-200 to-sky-300 px-4 py-3 md:px-6 shadow-md">
      {/* Mobile header */}
      <div className="flex items-center justify-between md:hidden">
        {showSidebarToggle ? (
          <button
            onClick={toggle}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white/90 text-blue-700 shadow-md transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
          >
            ☰
          </button>
        ) : (
          <div className="h-10 w-10" aria-hidden />
        )}

        <Link href="/dashboard" aria-label="Logo aplikasi">
          <Image
            src="/logo/TVRI_JAKARTA_2023.svg"
            alt="TVRI DKI Jakarta"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
        </Link>

        <UserMenu />
      </div>

      {/* Desktop header */}
      <div className="hidden md:block">
        <div className="rounded-xl border border-blue-200/50 bg-white/70 backdrop-blur-sm px-4 py-3 shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
            <div className="flex items-center gap-3">
              {showHeaderTitle ? (
                <>
                  <span className="h-7 w-1 rounded-full bg-linear-to-b from-blue-500 to-sky-600" />
                  <h1 className="truncate text-[clamp(20px,3vw,26px)] font-semibold leading-tight text-blue-700">
                    {title}
                  </h1>
                </>
              ) : null}
            </div>

            <Link href="/dashboard" aria-label="Logo aplikasi">
              <Image
                src="/logo/TVRI_JAKARTA_2023.svg"
                alt="TVRI DKI Jakarta"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            </Link>

            <div className="flex justify-end">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
