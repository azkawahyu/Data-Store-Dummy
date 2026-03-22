"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { broadcastAuthEvent } from "@/lib/auth-sync";

type JwtPayload = {
  role?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getDefaultRoute(role?: string | null) {
  return String(role ?? "").toLowerCase() === "employee"
    ? "/profile/employee"
    : "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace(getDefaultRoute(parseJwt(token)?.role));
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal. Coba lagi.");
        return;
      }

      localStorage.setItem("token", data.token);
      broadcastAuthEvent("login");

      router.replace(getDefaultRoute(parseJwt(data.token)?.role));
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background/background_login.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-slate-900/35" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-6">
            <div className="mb-5 flex items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-blue-200/70 bg-blue-50/80 px-4 py-3 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-100 to-sky-100 ring-1 ring-blue-200">
                  <Image
                    src="/logo/TVRI_JAKARTA_2023.svg"
                    alt="TVRI DKI Jakarta"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-800">
                    TVRI DKI JAKARTA
                  </span>
                  <span className="text-base font-semibold text-slate-900">
                    SmartStaff
                  </span>
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Datang
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Masuk untuk mengakses dashboard SmartStaff.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:pr-20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 md:inline-flex"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  <span className="sr-only">
                    {showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"}
                  </span>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.24-2.62 4.13-4.61 5.35M6.23 6.23C3.89 7.57 2 9.62 1 12c.69 1.55 1.7 2.94 2.95 4.07"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.46 12C3.73 7.94 7.52 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-700 hover:text-blue-900"
              >
                Lupa Password?
              </Link>
            </div>

            {error ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-lg bg-linear-to-r from-sky-400 to-blue-900 text-sm font-semibold text-white shadow-md transition hover:from-sky-500 hover:to-blue-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
