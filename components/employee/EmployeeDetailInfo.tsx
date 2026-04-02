import React from "react";

type Props = {
  employee: {
    nip: string;
    nama: string;
    jabatan: string;
    unit: string;
    email: string;
    no_hp: string;
    alamat: string;
  };
  canResetPassword?: boolean;
  onResetPassword?: () => void;
  resettingPassword?: boolean;
};

export default function EmployeeDetailInfo({
  employee,
  canResetPassword = false,
  onResetPassword,
  resettingPassword = false,
}: Props) {
  const fields = [
    { label: "NIP", value: employee.nip },
    { label: "Nama", value: employee.nama },
    { label: "Jabatan", value: employee.jabatan },
    { label: "Unit", value: employee.unit },
    { label: "Email", value: employee.email },
    { label: "No. HP", value: employee.no_hp },
    { label: "Alamat", value: employee.alamat },
  ];

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Informasi Pegawai
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan data pegawai yang tersimpan.
          </p>
        </div>
        {canResetPassword && onResetPassword ? (
          <button
            type="button"
            onClick={onResetPassword}
            disabled={resettingPassword}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resettingPassword ? "Mereset..." : "Reset Password"}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {field.label}
            </div>
            <div className="mt-1 wrap-break-word text-sm font-semibold text-slate-900">
              {field.value || "-"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
