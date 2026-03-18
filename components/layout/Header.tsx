"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function HeaderLogo({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      href="/dashboard"
      aria-label="Logo aplikasi"
      className={[
        "group inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-sky-200 hover:shadow-md",
        mobile ? "min-w-42 justify-center" : "",
      ].join(" ")}
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <Image
          src="/logo/TVRI_JAKARTA_2023.svg"
          alt="TVRI DKI Jakarta"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority={mobile}
        />
      </span>

      <span className="hidden text-left sm:flex sm:flex-col">
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
    <header className="z-20 border-b border-slate-200/90 bg-white px-4 py-3 md:px-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 md:px-4">
        <div className="mb-3 flex justify-center md:hidden">
          <HeaderLogo mobile />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
          <div className="min-w-0 pl-11 md:pl-0">
            <div className="flex items-center gap-3">
              <span className="hidden h-7 w-1 rounded-full bg-sky-500 sm:inline-block" />
              <h1 className="truncate text-[clamp(20px,3vw,26px)] font-semibold leading-tight text-slate-900">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:justify-center">
            <HeaderLogo />
          </div>

          <div className="ml-auto md:col-start-3 md:ml-0 md:flex md:justify-end">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
