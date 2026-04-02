"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<string>;
}

export default function ResetPasswordModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setTemporaryPassword("");
      setCopySuccess(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleConfirm() {
    try {
      setLoading(true);
      setError("");
      const tempPassword = await onConfirm();

      if (!tempPassword) {
        throw new Error("Password sementara tidak ditemukan.");
      }

      setTemporaryPassword(tempPassword);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal reset password.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 1500);
    } catch {
      setCopySuccess(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {temporaryPassword ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                Password sementara
              </p>
              <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-sm text-slate-900">
                {temporaryPassword}
              </p>
              <p className="mt-2 text-xs text-amber-800">
                Simpan password ini dan berikan langsung ke pegawai. Password
                ini hanya sekali pakai.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {copySuccess ? "Tersalin" : "Salin Password"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
