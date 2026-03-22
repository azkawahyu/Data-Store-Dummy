"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

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
  email?: string | null;
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

function getRoleLabel(role?: string | null) {
  const normalized = (role ?? "").toLowerCase();
  if (normalized === "admin") return "Admin";
  if (normalized === "employee") return "Pegawai";
  if (normalized === "hr") return "Admin Umum";
  return "-";
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
      <section className="header-card page-panel">
        <div className="page-header">
          <div className="min-w-0">
            <h1 className="page-title text-gradient-primary">Profil Akun</h1>
            <p className="page-subtitle">
              Ringkasan akun login dan keterkaitannya dengan data pegawai.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push("/dashboard")}
            >
              ← Kembali ke Dashboard
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openEditModal}
            >
              Edit Akun
            </button>
          </div>
        </div>
      </section>

      <section className="page-panel p-5 sm:p-6">
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h2 className="employee-card-title text-gradient-primary">
              Data Akun
            </h2>
            <p className="employee-card-subtitle">
              Informasi akun yang digunakan untuk masuk ke aplikasi.
            </p>
          </div>
          <div className="employee-card-icon" aria-hidden="true">
            🔐
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

      <section className="page-panel p-5 sm:p-6">
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h2 className="employee-card-title text-gradient-primary">
              Koneksi Data Pegawai
            </h2>
            <p className="employee-card-subtitle">
              Status hubungan akun ini dengan data pegawai di sistem.
            </p>
          </div>
          <div className="employee-card-icon" aria-hidden="true">
            🔗
          </div>
        </div>

        <div className="employee-profile-grid">
          <div className="employee-profile-item">
            <div className="employee-profile-label">Status</div>
            <div className="employee-profile-value">
              {userProfile?.employee_id ? "Terhubung" : "Belum terhubung"}
            </div>
          </div>
          <div className="employee-profile-item">
            <div className="employee-profile-label">Data Pegawai</div>
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
            <div className="employee-profile-label">Unit / Jabatan</div>
            <div className="employee-profile-value">
              {[employeeProfile?.unit, employeeProfile?.jabatan]
                .filter(Boolean)
                .join(" • ") || "-"}
            </div>
          </div>
        </div>

        {userProfile?.link_message && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {userProfile.link_message}
          </div>
        )}
      </section>

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
              <button
                type="button"
                onClick={() => setOpenEdit(false)}
                className="btn btn-secondary shrink-0"
              >
                Tutup
              </button>
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
