"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useSidebar } from "./SidebarContext";

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function HeaderLogo() {
  return (
    <Link
      href="/dashboard"
      aria-label="Logo aplikasi"
      className="group inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-sky-200 hover:shadow-md"
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <Image
          src="/logo/TVRI_JAKARTA_2023.svg"
          alt="TVRI DKI Jakarta"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </span>
      <span className="flex flex-col text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          TVRI DKI JAKARTA
        </span>
        <span className="text-sm font-semibold text-slate-700 transition group-hover:text-slate-900">
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

  const title = useMemo(() => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    const map: Record<string, string> = {
      dashboard: "Dashboard",
      profile: "Profil Akun",
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
    <header className="z-20 border-b border-slate-200/90 bg-white px-4 py-3 md:px-6">
      {/* Mobile header */}
      <div className="flex items-center justify-between md:hidden">
        {showSidebarToggle ? (
          <button
            onClick={toggle}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
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
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-sky-500" />
              <h1 className="truncate text-[clamp(20px,3vw,26px)] font-semibold leading-tight text-slate-900">
                {title}
              </h1>
            </div>

            <div className="flex items-center justify-center">
              <HeaderLogo />
            </div>

            <div className="flex justify-end">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
