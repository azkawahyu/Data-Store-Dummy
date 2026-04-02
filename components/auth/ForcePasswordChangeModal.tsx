"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  saving: boolean;
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
}

export default function ForcePasswordChangeModal({
  open,
  saving,
  onSubmit,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Password baru wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    await onSubmit(password, confirmPassword);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <form
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold text-slate-900">
          Wajib Ubah Password
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Akun ini menggunakan password sementara. Silakan buat password baru
          untuk melanjutkan.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
  );
}
