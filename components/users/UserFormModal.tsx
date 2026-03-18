"use client";

import type {
  EmployeeItem,
  RoleItem,
  UserFormErrors,
  UserFormState,
} from "./types";

interface Props {
  open: boolean;
  editing: boolean;
  saving: boolean;
  form: UserFormState;
  fieldErrors: UserFormErrors;
  roles: RoleItem[];
  employees: EmployeeItem[];
  autoLinkHint: string;
  isFormValid: boolean;
  onChangeField: (field: keyof UserFormState, value: string) => void;
  onBlurField: (field: keyof UserFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function UserFormModal({
  open,
  editing,
  saving,
  form,
  fieldErrors,
  roles,
  employees,
  autoLinkHint,
  isFormValid,
  onChangeField,
  onBlurField,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            {editing ? "Edit User" : "Tambah User"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {editing
              ? "Perbarui role, email, atau relasi pegawai."
              : "Buat akun baru untuk login sistem."}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              value={form.username}
              disabled={editing}
              onChange={(e) => onChangeField("username", e.target.value)}
              onBlur={() => onBlurField("username")}
              placeholder="Username"
              className={`input ${
                fieldErrors.username ? "border-red-300 bg-red-50" : ""
              }`}
            />
            {fieldErrors.username && (
              <p className="text-xs text-red-600">{fieldErrors.username}</p>
            )}
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              NIP <span className="text-red-500">*</span>
            </label>
            <input
              value={form.nip}
              onChange={(e) => onChangeField("nip", e.target.value)}
              onBlur={() => onBlurField("nip")}
              placeholder="Nomor Induk Pegawai"
              className={`input ${
                fieldErrors.nip ? "border-red-300 bg-red-50" : ""
              }`}
            />
            {fieldErrors.nip && (
              <p className="text-xs text-red-600">{fieldErrors.nip}</p>
            )}
          </div>

          {!editing && (
            <div className="grid gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => onChangeField("password", e.target.value)}
                onBlur={() => onBlurField("password")}
                placeholder="Password"
                className={`input ${
                  fieldErrors.password ? "border-red-300 bg-red-50" : ""
                }`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>
          )}

          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChangeField("email", e.target.value)}
              onBlur={() => onBlurField("email")}
              placeholder="Email"
              className={`input ${
                fieldErrors.email ? "border-red-300 bg-red-50" : ""
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role_id}
              onChange={(e) => onChangeField("role_id", e.target.value)}
              onBlur={() => onBlurField("role_id")}
              className={`select ${
                fieldErrors.role_id ? "border-red-300 bg-red-50" : ""
              }`}
            >
              <option value="">Pilih Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {fieldErrors.role_id && (
              <p className="text-xs text-red-600">{fieldErrors.role_id}</p>
            )}
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pegawai{" "}
              <span className="text-slate-400 normal-case">(opsional)</span>
            </label>
            <select
              value={form.employee_id}
              onChange={(e) => onChangeField("employee_id", e.target.value)}
              onBlur={() => onBlurField("employee_id")}
              className="select"
            >
              <option value="">Tidak terkait pegawai</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.nama} ({employee.nip})
                </option>
              ))}
            </select>
            {autoLinkHint && (
              <p
                className={`text-xs ${
                  autoLinkHint.toLowerCase().includes("konflik")
                    ? "text-amber-700"
                    : autoLinkHint.toLowerCase().includes("belum")
                      ? "text-slate-500"
                      : "text-indigo-700"
                }`}
              >
                {autoLinkHint}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="btn btn-secondary"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || !isFormValid}
            className="btn btn-primary"
          >
            {saving
              ? "Menyimpan..."
              : editing
                ? "Simpan Perubahan"
                : "Buat User"}
          </button>
        </div>
      </div>
    </div>
  );
}
