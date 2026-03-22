"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type JwtPayload = {
  role?: string;
  username?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  queueMicrotask(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = parseJwt(token);
  return String(payload?.role ?? "").toLowerCase();
}

function getServerSnapshot() {
  return null;
}

export default function HrPage() {
  const router = useRouter();
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (role === null) {
      return;
    }

    if (role !== "hr") {
      router.replace("/dashboard");
    }
  }, [router, role]);

  if (role !== "hr") {
    return (
      <div className="p-6 text-slate-500">Loading halaman Admin Umum...</div>
    );
  }

  return (
    <div className="page-shell space-y-4">
      <section className="header-card page-panel">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="min-w-0">
            <h1 className="page-title text-gradient-primary">Admin Umum</h1>
            <p className="page-subtitle">
              Selamat datang. Anda dapat memverifikasi dan mengelola data
              operasional.
            </p>
          </div>
        </div>
      </section>

      <section className="card grid gap-3 sm:grid-cols-2">
        <Link
          href="/documents"
          className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 hover:bg-cyan-100"
        >
          <h2 className="text-sm font-semibold text-cyan-900">
            Verifikasi Dokumen
          </h2>
          <p className="mt-1 text-xs text-cyan-800">
            Buka daftar dokumen untuk verifikasi atau penolakan.
          </p>
        </Link>

        <Link
          href="/employee"
          className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 hover:bg-indigo-100"
        >
          <h2 className="text-sm font-semibold text-indigo-900">
            Kelola Data Karyawan
          </h2>
          <p className="mt-1 text-xs text-indigo-800">
            Tambah dan edit data karyawan tanpa akses hapus.
          </p>
        </Link>

        <Link
          href="/dashboard"
          className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 hover:bg-emerald-100"
        >
          <h2 className="text-sm font-semibold text-emerald-900">
            Lihat Dashboard
          </h2>
          <p className="mt-1 text-xs text-emerald-800">
            Pantau ringkasan data operasional terkini.
          </p>
        </Link>

        <Link
          href="/profile"
          className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
        >
          <h2 className="text-sm font-semibold text-slate-900">Profil Akun</h2>
          <p className="mt-1 text-xs text-slate-600">
            Perbarui informasi akun Anda.
          </p>
        </Link>
      </section>

      <section className="card">
        <h3 className="text-sm font-semibold text-slate-900">
          Batasan Akses Admin Umum
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Tidak dapat mengakses halaman aktivitas sistem.</li>
          <li>Tidak dapat mengakses pengaturan pengguna/role.</li>
          <li>Tidak dapat menghapus data.</li>
        </ul>
      </section>
    </div>
  );
}
