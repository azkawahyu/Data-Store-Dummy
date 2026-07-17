"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { broadcastAuthEvent } from "@/lib/auth-sync";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/validations/userRules";

type JwtPayload = {
  role?: string;
  mustChangePassword?: boolean;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as JwtPayload;
  } catch {
    return null;
  }
}

function getDefaultRoute(role?: string | null) {
  return String(role ?? "").toLowerCase() === "employee"
    ? "/profile/employee"
    : "/dashboard";
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = parseJwt(token);
    if (!payload?.mustChangePassword) {
      router.replace(getDefaultRoute(payload?.role));
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError("Password harus mengandung huruf dan angka tanpa spasi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, confirmPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal mengubah password.");
        return;
      }

      localStorage.setItem("token", data.token);
      broadcastAuthEvent("login");
      router.replace(getDefaultRoute(parseJwt(data.token)?.role));
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background/background_login.jpeg')" }}
      />
      <div className="absolute inset-0 bg-slate-900/35" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ubah Password
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Demi keamanan akun, buat password baru sebelum melanjutkan.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-slate-900">
                Password Baru
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                autoComplete="new-password"
                required
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Minimal 8 karakter, mengandung huruf dan angka, tanpa spasi.
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-900">
                Konfirmasi Password Baru
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                autoComplete="new-password"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="h-11 w-full rounded-lg bg-linear-to-r from-sky-400 to-blue-900 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-blue-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
