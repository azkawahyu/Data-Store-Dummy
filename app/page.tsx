"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      router.push("/dashboard");
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
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
              <input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
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
              className="h-11 w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
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
