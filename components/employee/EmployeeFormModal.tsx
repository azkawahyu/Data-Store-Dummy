"use client";

import { useEffect, useMemo, useState } from "react";
import type { Employee } from "@/types/employee";

type EmployeeForm = Omit<Employee, "id" | "created_at" | "updated_at">;

type FieldErrors = Partial<Record<keyof EmployeeForm, string>>;

interface Props {
  open: boolean;
  initial: Employee | null; // null = tambah, ada isi = edit
  onClose: () => void;
  onSubmit: (form: EmployeeForm) => Promise<void>;
  title?: string;
  submitLabel?: string;
  hideCloseButton?: boolean;
  hideCancelButton?: boolean;
  disableBackdropClose?: boolean;
  prefillNip?: string | null;
  lockNip?: boolean;
  prefillEmail?: string | null;
  lockEmail?: boolean;
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

// ── Helpers ──────────────────────────────────────────────
function validateForm(form: EmployeeForm): FieldErrors {
  const errors: FieldErrors = {};

  // NIP: wajib, hanya angka, min 5 karakter
  if (!form.nip.trim()) {
    errors.nip = "NIP wajib diisi.";
  } else if (!/^\d+$/.test(form.nip.trim())) {
    errors.nip = "NIP hanya boleh berisi angka.";
  } else if (form.nip.trim().length < 5) {
    errors.nip = "NIP minimal 5 digit.";
  } else if (form.nip.trim().length > 20) {
    errors.nip = "NIP maksimal 20 digit.";
  }

  // Nama: wajib, min 2 karakter, hanya huruf/spasi/tanda baca nama
  if (!form.nama.trim()) {
    errors.nama = "Nama lengkap wajib diisi.";
  } else if (form.nama.trim().length < 2) {
    errors.nama = "Nama minimal 2 karakter.";
  } else if (!/^[A-Za-z\u00C0-\u024F\s'.,-]+$/.test(form.nama.trim())) {
    errors.nama = "Nama hanya boleh berisi huruf dan spasi.";
  }

  // Jabatan: wajib, min 2 karakter
  if (!form.jabatan.trim()) {
    errors.jabatan = "Jabatan wajib diisi.";
  } else if (form.jabatan.trim().length < 2) {
    errors.jabatan = "Jabatan minimal 2 karakter.";
  }

  // Unit: wajib dipilih
  if (!form.unit) {
    errors.unit = "Unit wajib dipilih.";
  }

  // Email: wajib, harus valid
  if (!form.email || !form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  // Alamat: wajib
  if (!form.alamat || !form.alamat.trim()) {
    errors.alamat = "Alamat wajib diisi.";
  }

  // No. HP: wajib
  if (!form.no_hp || !form.no_hp.trim()) {
    errors.no_hp = "No. HP wajib diisi.";
  } else {
    const val = form.no_hp.trim();
    if (!/^(\+62|0)/.test(val)) {
      errors.no_hp = "No. HP harus diawali dengan +62 atau 0.";
    } else if (!/^(\+62|0)\d+$/.test(val)) {
      errors.no_hp = "No. HP hanya boleh berisi angka setelah awalan.";
    } else {
      // hitung digit saja (tanpa +)
      const digits = val.replace(/^\+/, "").replace(/\D/g, "");
      if (digits.length < 9) {
        errors.no_hp = "No. HP terlalu pendek (minimal 9 digit).";
      } else if (digits.length > 14) {
        errors.no_hp = "No. HP terlalu panjang (maksimal 14 digit).";
      }
    }
  }

  return errors;
}

export default function EmployeeFormModal({
  open,
  initial,
  onClose,
  onSubmit,
  title,
  submitLabel,
  hideCloseButton = false,
  hideCancelButton = false,
  disableBackdropClose = false,
  prefillNip,
  lockNip = false,
  prefillEmail,
  lockEmail = false,
}: Props) {
  const [form, setForm] = useState<EmployeeForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof EmployeeForm, boolean>>
  >({});

  const isFormValid = useMemo(
    () => Object.keys(validateForm(form)).length === 0,
    [form],
  );

  // Isi form saat edit, kosongkan saat tambah
  useEffect(() => {
    if (!open) return;
    if (initial) {
      const { id, created_at, updated_at, ...rest } = initial;
      void id;
      void created_at;
      void updated_at;
      setForm({
        ...rest,
        nip: rest.nip?.trim() ? rest.nip : (prefillNip?.trim() ?? ""),
        email: rest.email?.trim() ? rest.email : (prefillEmail?.trim() ?? ""),
      });
    } else {
      setForm({
        ...EMPTY,
        nip: prefillNip?.trim() ?? "",
        email: prefillEmail?.trim() ?? "",
      });
    }
    setServerError("");
    setFieldErrors({});
    setTouched({});
  }, [open, initial, prefillNip, prefillEmail]);

  if (!open) return null;

  function set(field: keyof EmployeeForm, value: string) {
    setForm((p) => {
      const next = { ...p, [field]: value };
      // re-validate field if already touched
      if (touched[field]) {
        const errs = validateForm(next);
        setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
      }
      return next;
    });
  }

  // Filter NIP: tolak karakter non-digit saat mengetik
  function handleNipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    set("nip", digitsOnly);
  }

  // Filter No. HP: izinkan + hanya di awal, lalu digit saja
  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Izinkan + di posisi pertama, sisanya hanya angka
    const cleaned = raw
      .split("")
      .filter((ch, idx) => (idx === 0 && ch === "+") || /\d/.test(ch))
      .join("");
    set("no_hp", cleaned);
  }

  function handleBlur(field: keyof EmployeeForm) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateForm(form);
    setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    // Tandai semua field sebagai touched
    const allTouched: Partial<Record<keyof EmployeeForm, boolean>> = {};
    (Object.keys(EMPTY) as (keyof EmployeeForm)[]).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    const errs = validateForm(form);
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      await onSubmit(form);
      onClose();
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
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
        .emp-form-input:disabled,
        .emp-form-select:disabled {
          background: #f8fafc;
          color: #64748b;
          cursor: not-allowed;
        }
        .emp-form-input-error {
          border-color: #f87171 !important;
          background: #fff7f7;
        }
        .emp-form-input-error:focus {
          border-color: #ef4444 !important;
        }
        .emp-field-error {
          font-size: 11.5px;
          color: #dc2626;
          margin-top: 2px;
        }
        .emp-field-hint {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 2px;
        }
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
        .emp-btn:disabled { cursor: not-allowed; }
        .emp-btn-primary {
          background: #06b6d4;
          color: white;
          border-color: #06b6d4;
        }
        .emp-btn-primary:disabled {
          background: #cbd5e1;
          border-color: #cbd5e1;
          color: #94a3b8;
          opacity: 1;
        }
        .emp-btn-batal {
            background: #ef4444;
            color: white;
            border-color: #ef4444;
        }
        .emp-btn-batal:disabled { opacity: .5; }
          .emp-btn-batal:hover:not(:disabled) { background: #dc2626; }
        .emp-btn-primary:hover:not(:disabled) { background: #1e293b; }

        @media (max-width: 480px) {
          .emp-form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        className="emp-modal-overlay"
        onClick={() => {
          if (!disableBackdropClose) onClose();
        }}
      >
        <div className="emp-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="emp-modal-header">
            <h3 className="emp-modal-title">
              {title ?? (initial ? "Edit Pegawai" : "Tambah Pegawai")}
            </h3>
            {!hideCloseButton && (
              <button
                className="emp-modal-close"
                onClick={onClose}
                aria-label="Tutup"
              >
                ×
              </button>
            )}
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="emp-modal-body">
              {serverError && (
                <div className="emp-form-error">{serverError}</div>
              )}

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    NIP <span>*</span>
                  </label>
                  <input
                    className={`emp-form-input${fieldErrors.nip ? " emp-form-input-error" : ""}`}
                    value={form.nip}
                    onChange={handleNipChange}
                    onBlur={() => handleBlur("nip")}
                    placeholder="1234567890"
                    inputMode="numeric"
                    maxLength={20}
                    disabled={lockNip}
                  />
                  {lockNip && form.nip && (
                    <span className="emp-field-hint">Mengikuti NIP akun.</span>
                  )}
                  {fieldErrors.nip && (
                    <span className="emp-field-error">{fieldErrors.nip}</span>
                  )}
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
                  className={`emp-form-input${fieldErrors.nama ? " emp-form-input-error" : ""}`}
                  value={form.nama}
                  onChange={(e) => set("nama", e.target.value)}
                  onBlur={() => handleBlur("nama")}
                  placeholder="John Doe"
                />
                {fieldErrors.nama && (
                  <span className="emp-field-error">{fieldErrors.nama}</span>
                )}
              </div>

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Jabatan <span>*</span>
                  </label>
                  <input
                    className={`emp-form-input${fieldErrors.jabatan ? " emp-form-input-error" : ""}`}
                    value={form.jabatan}
                    onChange={(e) => set("jabatan", e.target.value)}
                    onBlur={() => handleBlur("jabatan")}
                    placeholder="Staff IT"
                  />
                  {fieldErrors.jabatan && (
                    <span className="emp-field-error">
                      {fieldErrors.jabatan}
                    </span>
                  )}
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Unit <span>*</span>
                  </label>
                  <select
                    className={`emp-form-select${fieldErrors.unit ? " emp-form-input-error" : ""}`}
                    value={form.unit}
                    onChange={(e) => set("unit", e.target.value)}
                    onBlur={() => handleBlur("unit")}
                  >
                    <option value="">-- Pilih Unit --</option>
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.unit && (
                    <span className="emp-field-error">{fieldErrors.unit}</span>
                  )}
                </div>
              </div>

              <div className="emp-form-row">
                <div className="emp-form-group">
                  <label className="emp-form-label">
                    Email <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`emp-form-input${fieldErrors.email ? " emp-form-input-error" : ""}`}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="john@company.local"
                    disabled={lockEmail}
                  />
                  {lockEmail && form.email && (
                    <span className="emp-field-hint">
                      Mengikuti email akun.
                    </span>
                  )}
                  {fieldErrors.email && (
                    <span className="emp-field-error">{fieldErrors.email}</span>
                  )}
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">
                    No. HP <span>*</span>
                  </label>
                  <input
                    className={`emp-form-input${fieldErrors.no_hp ? " emp-form-input-error" : ""}`}
                    value={form.no_hp}
                    onChange={handlePhoneChange}
                    onBlur={() => handleBlur("no_hp")}
                    placeholder="+628123456789 atau 08123456789"
                    inputMode="tel"
                    maxLength={16}
                  />
                  {fieldErrors.no_hp && (
                    <span className="emp-field-error">{fieldErrors.no_hp}</span>
                  )}
                </div>
              </div>

              <div className="emp-form-group">
                <label className="emp-form-label">
                  Alamat <span>*</span>
                </label>
                <input
                  className={`emp-form-input${fieldErrors.alamat ? " emp-form-input-error" : ""}`}
                  value={form.alamat}
                  onChange={(e) => set("alamat", e.target.value)}
                  onBlur={() => handleBlur("alamat")}
                  placeholder="Jl. Merdeka No.1 Jakarta"
                />
                {fieldErrors.alamat && (
                  <span className="emp-field-error">{fieldErrors.alamat}</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="emp-modal-footer">
              {!hideCancelButton && (
                <button
                  type="button"
                  className="emp-btn emp-btn-batal"
                  onClick={onClose}
                  disabled={loading}
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="emp-btn emp-btn-primary"
                disabled={loading || !isFormValid}
              >
                {loading
                  ? "Menyimpan..."
                  : (submitLabel ??
                    (initial ? "Simpan Perubahan" : "Tambah Pegawai"))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
