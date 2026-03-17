"use client";

import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";

type EmployeeForm = Omit<Employee, "id" | "created_at" | "updated_at">;

interface Props {
  open: boolean;
  initial: Employee | null; // null = tambah, ada isi = edit
  onClose: () => void;
  onSubmit: (form: EmployeeForm) => Promise<void>;
}

const EMPTY: EmployeeForm = {
  nip: "",
  nama: "",
  jabatan: "",
  unit: "",
  status: "Tetap",
  alamat: "",
  no_hp: "",
  email: "",
};

const UNIT_OPTIONS = [
  "Teknik",
  "Umum",
  "Program",
  "Berita",
  "Keuangan",
  "KMB",
  "Tata Usaha",
  "Kepala Stasiun",
];

export default function EmployeeFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<EmployeeForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Isi form saat edit, kosongkan saat tambah
  useEffect(() => {
    if (!open) return;
    if (initial) {
      const { id, created_at, updated_at, ...rest } = initial;
      void id;
      void created_at;
      void updated_at;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [open, initial]);

  if (!open) return null;

  function set(field: keyof EmployeeForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nip || !form.nama || !form.jabatan || !form.unit) {
      setError("NIP, Nama, Jabatan, dan Unit wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
      onClose();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .emp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,.45);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .emp-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(15,23,42,.2);
          display: flex;
          flex-direction: column;
        }
        .emp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 16px 16px 0 0;
          z-index: 1;
        }
        .emp-modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .emp-modal-close {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 20px;
          color: #94a3b8;
          padding: 4px;
          border-radius: 6px;
          transition: color .15s;
          line-height: 1;
        }
        .emp-modal-close:hover { color: #0f172a; }
        .emp-modal-body {
          padding: 20px 24px;
          display: grid;
          gap: 14px;
        }
        .emp-modal-footer {
          padding: 16px 24px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          border-top: 1px solid #f1f5f9;
        }
        .emp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .emp-form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .emp-form-label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .emp-form-label span { color: #ef4444; }
        .emp-form-input,
        .emp-form-select {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color .2s;
          background: white;
          color: #0f172a;
        }
        .emp-form-input:focus,
        .emp-form-select:focus { border-color: #94a3b8; }
        .emp-form-error {
          font-size: 13px;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .emp-btn {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          transition: background .15s;
        }
        .emp-btn:hover { background: #f1f5f9; }
        .emp-btn:disabled { opacity: .5; cursor: not-allowed; }
        .emp-btn-primary {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }
        .emp-btn-primary:hover:not(:disabled) { background: #1e293b; }

        @media (max-width: 480px) {
          .emp-form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="emp-modal-overlay" onClick={onClose}>
        <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="emp-modal-header">
            <h3 className="emp-modal-title">
              {initial ? "Edit Pegawai" : "Tambah Pegawai"}
            </h3>
            <button
              className="emp-modal-close"
              onClick={onClose}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="emp-modal-body">
              {error && <div className="emp-form-error">{error}</div>}

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    NIP <span>*</span>
                  </label>
                  <input
                    className="emp-form-input"
                    value={form.nip}
                    onChange={(e) => set("nip", e.target.value)}
                    placeholder="EMP001"
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Status <span>*</span>
                  </label>
                  <select
                    className="emp-form-select"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                  </select>
                </div>
              </div>

              <div className="emp-form-group">
                <label className="emp-form-label">
                  Nama Lengkap <span>*</span>
                </label>
                <input
                  className="emp-form-input"
                  value={form.nama}
                  onChange={(e) => set("nama", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Jabatan <span>*</span>
                  </label>
                  <input
                    className="emp-form-input"
                    value={form.jabatan}
                    onChange={(e) => set("jabatan", e.target.value)}
                    placeholder="Staff IT"
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Unit <span>*</span>
                  </label>
                  <select
                    className="emp-form-select"
                    value={form.unit}
                    onChange={(e) => set("unit", e.target.value)}
                  >
                    <option value="">-- Pilih Unit --</option>
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">Email</label>
                  <input
                    type="email"
                    className="emp-form-input"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="john@company.local"
                  />
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">No. HP</label>
                  <input
                    className="emp-form-input"
                    value={form.no_hp}
                    onChange={(e) => set("no_hp", e.target.value)}
                    placeholder="08123456789"
                  />
                </div>
              </div>

              <div className="emp-form-group">
                <label className="emp-form-label">Alamat</label>
                <input
                  className="emp-form-input"
                  value={form.alamat}
                  onChange={(e) => set("alamat", e.target.value)}
                  placeholder="Jl. Merdeka No.1 Jakarta"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="emp-modal-footer">
              <button
                type="button"
                className="emp-btn"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="emp-btn emp-btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Menyimpan..."
                  : initial
                    ? "Simpan Perubahan"
                    : "Tambah Pegawai"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
