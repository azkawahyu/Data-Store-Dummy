"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import {
  getEmployeeConnectionLabel,
  getEmployeeConnectionNoticeTitle,
  getEmployeeConnectionTone,
  getRoleLabel,
} from "@/components/common/labels";
import type {
  Employee as EmployeeEntity,
  EmployeeForm as EmployeeFormPayload,
} from "@/types/employee";

type JwtPayload = {
  userId?: string | number;
  sub?: string | number;
  username?: string;
  role?: string;
  email?: string;
};

type UserProfile = {
  id: string;
  username?: string | null;
  nip?: string | null;
  email?: string | null;
  role_id?: string | null;
  employee_id: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
};

type EmployeeProfile = {
  id: string;
  nama?: string | null;
  nip?: string | null;
  jabatan?: string | null;
  unit?: string | null;
  status?: string | null;
  alamat?: string | null;
  email?: string | null;
  no_hp?: string | null;
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

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nip: "",
    email: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const backTarget = role === "employee" ? "/profile/employee" : "/dashboard";

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        const userId = String(payload?.userId ?? payload?.sub ?? "");
        const parsedRole = String(payload?.role ?? "").toLowerCase();
        setRole(parsedRole || null);

        if (!userId) {
          router.push("/login");
          return;
        }

        const userRes = await apiFetch(`/api/user/${userId}`).catch(() => null);
        if (userRes && typeof userRes === "object") {
          const user = userRes as UserProfile;
          setUserProfile(user);

          if (user.employee_id) {
            const employeeRes = await apiFetch(
              `/api/employees/${user.employee_id}`,
            ).catch(() => null);

            if (employeeRes && typeof employeeRes === "object") {
              setEmployeeProfile(employeeRes as EmployeeProfile);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading profile...</div>;
  }

  function openEditModal() {
    setForm({
      nip: userProfile?.nip ?? "",
      email: userProfile?.email ?? "",
    });
    setFormError(null);
    setOpenEdit(true);
  }

  const employeeId = userProfile?.employee_id ?? null;

  const initialEmployeeForm: EmployeeEntity | null = employeeId
    ? {
        id: employeeId,
        nip: employeeProfile?.nip ?? "",
        nama: employeeProfile?.nama ?? "",
        jabatan: employeeProfile?.jabatan ?? "",
        unit: employeeProfile?.unit ?? "",
        status: employeeProfile?.status === "Kontrak" ? "Kontrak" : "Tetap",
        alamat: employeeProfile?.alamat ?? "",
        no_hp: employeeProfile?.no_hp ?? "",
        email: employeeProfile?.email ?? "",
        created_at: "",
        updated_at: "",
      }
    : null;

  async function handleSubmitEmployee(formData: EmployeeFormPayload) {
    try {
      if (!employeeId) {
        const created = await apiFetch("/api/employees", {
          method: "POST",
          body: JSON.stringify({ ...formData, linkToCurrentUser: true }),
        });
        const created_profile =
          created?.data && typeof created.data === "object"
            ? (created.data as EmployeeProfile)
            : created && typeof created === "object" && "id" in created
              ? (created as EmployeeProfile)
              : null;
        if (!created_profile) throw new Error("Gagal membuat data pegawai.");
        setEmployeeProfile(created_profile);
        if (userProfile)
          setUserProfile({ ...userProfile, employee_id: created_profile.id });
        setOpenEditEmployee(false);
        toast.push("Data pegawai berhasil dibuat.", "success");
        return;
      }
      const updated = await apiFetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!updated || typeof updated !== "object")
        throw new Error("Gagal memperbarui data pegawai.");
      setEmployeeProfile(updated as EmployeeProfile);
      setOpenEditEmployee(false);
      toast.push("Data pegawai berhasil diperbarui.", "success");
    } catch (error) {
      toast.push("Gagal menyimpan data pegawai.", "error");
      throw error instanceof Error
        ? error
        : new Error("Gagal menyimpan data pegawai.");
    }
  }

  async function handleSubmitEdit() {
    if (!userProfile?.id || !userProfile.role_id) {
      setFormError("Data akun belum lengkap untuk diperbarui.");
      return;
    }

    if (!form.nip.trim()) {
      setFormError("NIP wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Email wajib diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError("Format email tidak valid.");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const updated = await apiFetch(`/api/user/${userProfile.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nip: form.nip.trim(),
          email: form.email.trim(),
          role_id: userProfile.role_id,
          employee_id: userProfile.employee_id,
        }),
      });

      if (updated && typeof updated === "object") {
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                nip: form.nip.trim(),
                email: form.email.trim(),
              }
            : prev,
        );
        setOpenEdit(false);
        toast.push("Profil akun berhasil diperbarui", "success");
        return;
      }

      setFormError("Gagal memperbarui profil akun.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui profil akun.";
      setFormError(message);
      toast.push("Gagal memperbarui profil akun", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell">
      {/* ── Hero Banner ── */}
      <section
        className="page-panel"
        style={{
          padding: "22px 24px",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)",
          border: "1px solid #bfdbfe",
        }}
      >
        {/* decorative blobs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(99,102,241,.14), transparent 38%), radial-gradient(circle at bottom left, rgba(6,182,212,.12), transparent 38%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* left: avatar + info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 0,
            }}
          >
            {/* avatar circle */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 24,
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(99,102,241,.30)",
                border: "2.5px solid rgba(255,255,255,.55)",
                letterSpacing: -1,
              }}
            >
              {(userProfile?.username?.[0] ?? "?").toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(17px,3vw,21px)",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {userProfile?.username || "-"}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,.7))",
                    border: "1px solid rgba(99,102,241,.25)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#4f46e5",
                    letterSpacing: ".05em",
                    textTransform: "uppercase",
                  }}
                >
                  {getRoleLabel(role)}
                </span>
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: "#475569",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 280,
                }}
              >
                {userProfile?.email || userProfile?.nip || "Akun SmartStaff"}
              </p>
            </div>
          </div>

          {/* right: status chip + back button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 13px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: getEmployeeConnectionTone(
                  Boolean(userProfile?.employee_id),
                ).bg,
                color: getEmployeeConnectionTone(
                  Boolean(userProfile?.employee_id),
                ).color,
                border: `1px solid ${
                  getEmployeeConnectionTone(Boolean(userProfile?.employee_id))
                    .border
                }`,
                boxShadow: "0 2px 8px rgba(15,23,42,.06)",
              }}
            >
              {getEmployeeConnectionLabel(Boolean(userProfile?.employee_id))}
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push(backTarget)}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </section>

      {/* ── Data Akun ── */}
      <section className="page-panel" style={{ padding: "20px 22px" }}>
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h2 className="employee-card-title text-gradient-primary">
              Data Akun
            </h2>
            <p className="employee-card-subtitle">
              Informasi akun yang digunakan untuk masuk ke aplikasi.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={openEditModal}
            >
              ✏️ Edit Akun
            </button>
            <div className="employee-card-icon shrink-0" aria-hidden="true">
              🔐
            </div>
          </div>
        </div>

        <div className="employee-profile-grid">
          <div className="employee-profile-item">
            <div className="employee-profile-label">Username</div>
            <div className="employee-profile-value">
              {userProfile?.username || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Role</div>
            <div className="employee-profile-value">{getRoleLabel(role)}</div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Email Akun</div>
            <div className="employee-profile-value">
              {userProfile?.email || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">NIP Akun</div>
            <div className="employee-profile-value">
              {userProfile?.nip || "-"}
            </div>
          </div>
        </div>
      </section>

      {/* ── Data Pegawai ── */}
      <section className="page-panel" style={{ padding: "20px 22px" }}>
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h2 className="employee-card-title text-gradient-primary">
              Data Pegawai
            </h2>
            <p className="employee-card-subtitle">
              Informasi kepegawaian yang terhubung dengan akun ini.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpenEditEmployee(true)}
            >
              ✏️ {employeeId ? "Edit Data Pegawai" : "Lengkapi Data Pegawai"}
            </button>
            <div className="employee-card-icon shrink-0" aria-hidden="true">
              👤
            </div>
          </div>
        </div>

        {/* connection status notice */}
        {!userProfile?.employee_id && (
          <div
            style={{
              marginBottom: 14,
              padding: "10px 14px",
              borderRadius: 12,
              background: "#fffbeb",
              border: "1px solid #fcd34d",
              fontSize: 13,
              color: "#92400e",
              lineHeight: 1.5,
            }}
          >
            <strong>{getEmployeeConnectionNoticeTitle(false)}.</strong> Akun ini
            belum dikaitkan ke data pegawai. Klik tombol di atas untuk
            melengkapi data pegawai.
          </div>
        )}

        <div className="employee-profile-grid">
          <div className="employee-profile-item">
            <div className="employee-profile-label">Status Koneksi</div>
            <div
              className="employee-profile-value"
              style={{
                color: userProfile?.employee_id ? "#15803d" : "#b45309",
                fontWeight: 700,
              }}
            >
              {getEmployeeConnectionLabel(Boolean(userProfile?.employee_id))}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Nama Pegawai</div>
            <div className="employee-profile-value">
              {employeeProfile?.nama || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">NIP Pegawai</div>
            <div className="employee-profile-value">
              {employeeProfile?.nip || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Status Pegawai</div>
            <div className="employee-profile-value">
              {employeeProfile?.status || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Unit / Jabatan</div>
            <div className="employee-profile-value">
              {[employeeProfile?.unit, employeeProfile?.jabatan]
                .filter(Boolean)
                .join(" • ") || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Email Pegawai</div>
            <div className="employee-profile-value">
              {employeeProfile?.email || "-"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">No. HP</div>
            <div className="employee-profile-value">
              {employeeProfile?.no_hp || "-"}
            </div>
          </div>
        </div>

        {userProfile?.link_message && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 12,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: 13,
              color: "#475569",
            }}
          >
            {userProfile.link_message}
          </div>
        )}
      </section>

      <EmployeeFormModal
        open={openEditEmployee}
        initial={initialEmployeeForm}
        onClose={() => setOpenEditEmployee(false)}
        onSubmit={handleSubmitEmployee}
        title={employeeId ? "Edit Data Pegawai" : "Lengkapi Data Pegawai"}
        submitLabel={employeeId ? "Simpan Perubahan" : "Simpan Data Pegawai"}
        lockNip={Boolean(userProfile?.nip)}
        prefillNip={userProfile?.nip ?? null}
        lockEmail={Boolean(userProfile?.email)}
        prefillEmail={userProfile?.email ?? null}
      />

      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">
                  Edit Profil Akun
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Ubah data akun login Anda. Username dan role saat ini belum
                  dapat diubah dari halaman ini.
                </p>
              </div>
              {/* Tombol Tutup dipindah ke bawah, baris aksi */}
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Username
                </label>
                <input
                  value={userProfile?.username ?? ""}
                  disabled
                  className="input bg-slate-50 text-slate-500"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>
                <input
                  value={getRoleLabel(role)}
                  disabled
                  className="input bg-slate-50 text-slate-500"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NIP <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.nip}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nip: e.target.value }))
                  }
                  className="input"
                  placeholder="Nomor Induk Pegawai"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="input"
                  placeholder="Email akun"
                />
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpenEdit(false)}
                disabled={saving}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleSubmitEdit();
                }}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
