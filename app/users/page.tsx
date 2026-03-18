"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

type UserItem = {
  id: string;
  username: string;
  nip: string | null;
  email: string | null;
  role_id: string | null;
  employee_id: string | null;
  created_at: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
};

type RoleItem = {
  id: string;
  name: string;
};

type EmployeeItem = {
  id: string;
  nama: string;
  nip: string;
  email?: string | null;
};

type UserFormState = {
  username: string;
  nip: string;
  email: string;
  password: string;
  role_id: string;
  employee_id: string;
};

type UserFormErrors = Partial<Record<keyof UserFormState, string>>;

type JwtPayload = {
  role?: string;
  userId?: string;
  sub?: string;
};

const PAGE_SIZE = 8;

function normalizeValue(value?: string | null) {
  return value?.trim() ?? "";
}

function normalizeEmail(value?: string | null) {
  return normalizeValue(value).toLowerCase();
}

function resolveEmployeeCandidate(
  employees: EmployeeItem[],
  form: UserFormState,
): {
  employeeId: string;
  status: "linked_auto" | "unlinked" | "conflict";
  message: string;
} {
  const nipCandidate = normalizeValue(form.nip);
  const emailCandidate = normalizeEmail(form.email);

  const matchesByNip = nipCandidate
    ? employees.filter(
        (employee) => normalizeValue(employee.nip) === nipCandidate,
      )
    : [];

  const matchesByEmail = emailCandidate
    ? employees.filter(
        (employee) => normalizeEmail(employee.email) === emailCandidate,
      )
    : [];

  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      employeeId: "",
      status: "conflict",
      message: "Terdapat lebih dari satu kandidat pegawai. Pilih manual.",
    };
  }

  const singleByNip = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const singleByEmail = matchesByEmail.length === 1 ? matchesByEmail[0] : null;

  if (singleByNip && singleByEmail && singleByNip.id !== singleByEmail.id) {
    return {
      employeeId: "",
      status: "conflict",
      message:
        "NIP dan email cocok ke pegawai yang berbeda. Admin perlu memilih manual.",
    };
  }

  if (singleByNip) {
    return {
      employeeId: singleByNip.id,
      status: "linked_auto",
      message: `Terkait otomatis ke ${singleByNip.nama} berdasarkan NIP.`,
    };
  }

  if (singleByEmail) {
    return {
      employeeId: singleByEmail.id,
      status: "linked_auto",
      message: `Terkait otomatis ke ${singleByEmail.nama} berdasarkan email.`,
    };
  }

  return {
    employeeId: "",
    status: "unlinked",
    message: "Belum ada pegawai yang cocok otomatis.",
  };
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const p = token.split(".")[1];
    if (!p) return null;
    return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function toDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const initialForm: UserFormState = {
  username: "",
  nip: "",
  email: "",
  password: "",
  role_id: "",
  employee_id: "",
};

function validateUserForm(
  form: UserFormState,
  isEditing: boolean,
): UserFormErrors {
  const errors: UserFormErrors = {};

  if (!form.username.trim()) {
    errors.username = "Username wajib diisi.";
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(form.username.trim())) {
    errors.username =
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip.";
  } else if (form.username.trim().length < 3) {
    errors.username = "Username minimal 3 karakter.";
  }

  if (!isEditing) {
    if (!form.password.trim()) {
      errors.password = "Password wajib diisi.";
    } else if (form.password.length < 6) {
      errors.password = "Password minimal 6 karakter.";
    }
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.role_id) {
    errors.role_id = "Role wajib dipilih.";
  }

  return errors;
}

export default function UsersPage() {
  const router = useRouter();
  const toast = useToast();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const [form, setForm] = useState<UserFormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<UserFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof UserFormState, boolean>>
  >({});
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [employeeTouchedManual, setEmployeeTouchedManual] = useState(false);
  const [autoLinkHint, setAutoLinkHint] = useState("");

  const isFormValid = useMemo(
    () => Object.keys(validateUserForm(form, Boolean(editing))).length === 0,
    [editing, form],
  );

  const loadData = useCallback(async () => {
    const [usersRes, rolesRes, employeesRes] = await Promise.all([
      apiFetch("/api/user"),
      apiFetch("/api/roles"),
      apiFetch("/api/employees"),
    ]);

    setUsers(Array.isArray(usersRes) ? usersRes : []);
    setRoles(Array.isArray(rolesRes) ? rolesRes : []);
    setEmployees(Array.isArray(employeesRes) ? employeesRes : []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        const role = String(payload?.role ?? "").toLowerCase();
        if (role !== "admin") {
          toast.push("Hanya admin yang dapat mengelola akun user.", "error");
          router.push("/dashboard");
          return;
        }

        await loadData();
      } catch (error) {
        console.error(error);
        toast.push("Gagal memuat data user.", "error");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [loadData, router, toast]);

  const roleMap = useMemo(() => {
    return new Map(roles.map((role) => [role.id, role.name]));
  }, [roles]);

  const employeeMap = useMemo(() => {
    return new Map(employees.map((employee) => [employee.id, employee]));
  }, [employees]);

  const filteredUsers = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    return users.filter((user) => {
      const roleName = (user.role_id ? roleMap.get(user.role_id) : "") ?? "";
      const employeeName =
        (user.employee_id ? employeeMap.get(user.employee_id)?.nama : "") ?? "";

      const matchKeyword =
        user.username.toLowerCase().includes(keyword) ||
        (user.email ?? "").toLowerCase().includes(keyword) ||
        roleName.toLowerCase().includes(keyword) ||
        employeeName.toLowerCase().includes(keyword);

      const matchRole =
        roleFilter === "all" ||
        (user.role_id ? roleMap.get(user.role_id) === roleFilter : false);

      return matchKeyword && matchRole;
    });
  }, [users, debouncedSearch, roleFilter, roleMap, employeeMap]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const stats = useMemo(() => {
    const total = users.length;
    const admin = users.filter(
      (user) => ((user.role_id && roleMap.get(user.role_id)) ?? "") === "admin",
    ).length;
    const hr = users.filter(
      (user) => ((user.role_id && roleMap.get(user.role_id)) ?? "") === "hr",
    ).length;
    const employee = users.filter(
      (user) =>
        ((user.role_id && roleMap.get(user.role_id)) ?? "") === "employee",
    ).length;
    const unlinked = users.filter((user) => !user.employee_id).length;
    const conflict = users.filter(
      (user) => user.link_status === "conflict",
    ).length;
    return { total, admin, hr, employee, unlinked, conflict };
  }, [users, roleMap]);

  function openCreateModal() {
    setEditing(null);
    setForm(initialForm);
    setFieldErrors({});
    setTouched({});
    setEmployeeTouchedManual(false);
    setAutoLinkHint("");
    setFormOpen(true);
  }

  function openEditModal(user: UserItem) {
    setEditing(user);
    setForm({
      username: user.username,
      nip: user.nip ?? "",
      email: user.email ?? "",
      password: "",
      role_id: user.role_id ?? "",
      employee_id: user.employee_id ?? "",
    });
    setFieldErrors({});
    setTouched({});
    setEmployeeTouchedManual(Boolean(user.employee_id));
    setAutoLinkHint(
      user.link_status === "conflict"
        ? (user.link_message ?? "Perlu pengaitan manual oleh admin.")
        : "",
    );
    setFormOpen(true);
  }

  function handleFieldChange(field: keyof UserFormState, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "employee_id") {
        setEmployeeTouchedManual(true);
      }

      if (touched[field]) {
        const errs = validateUserForm(next, Boolean(editing));
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [field]: errs[field],
        }));
      }
      return next;
    });
  }

  useEffect(() => {
    if (!formOpen || employeeTouchedManual) return;

    const resolved = resolveEmployeeCandidate(employees, form);
    setAutoLinkHint(resolved.message);

    setForm((prev) => {
      if (resolved.status === "linked_auto") {
        if (prev.employee_id === resolved.employeeId) return prev;
        return { ...prev, employee_id: resolved.employeeId };
      }

      if (prev.employee_id === "" || Boolean(editing && prev.employee_id)) {
        return prev;
      }
      return { ...prev, employee_id: "" };
    });
  }, [editing, employees, employeeTouchedManual, form, formOpen]);

  function handleFieldBlur(field: keyof UserFormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validateUserForm(form, Boolean(editing));
    setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  async function handleSubmit() {
    const allTouched: Partial<Record<keyof UserFormState, boolean>> = {
      username: true,
      nip: true,
      email: true,
      password: true,
      role_id: true,
      employee_id: true,
    };
    setTouched(allTouched);

    const errors = validateUserForm(form, Boolean(editing));
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.push("Lengkapi data user terlebih dahulu.", "error");
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await apiFetch(`/api/user/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            nip: form.nip.trim() || null,
            email: form.email || null,
            role_id: form.role_id || null,
            employee_id: form.employee_id || null,
          }),
        });

        toast.push("User berhasil diperbarui.", "success");
      } else {
        await apiFetch("/api/user", {
          method: "POST",
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
            nip: form.nip.trim() || null,
            email: form.email || null,
            role_id: form.role_id || null,
            employee_id: form.employee_id || null,
          }),
        });

        toast.push("User berhasil ditambahkan.", "success");
      }

      setFormOpen(false);
      setForm(initialForm);
      setEditing(null);
      setEmployeeTouchedManual(false);
      setAutoLinkHint("");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.push("Gagal menyimpan data user.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      await apiFetch(`/api/user/${deleteTarget.id}`, { method: "DELETE" });
      toast.push("User berhasil dihapus.", "success");
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.push("Gagal menghapus user.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Memuat data user...</div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h2 className="page-title">Manajemen User</h2>
          <p className="page-subtitle">
            Kelola akun yang digunakan untuk login sistem
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          + Tambah User
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total User" value={stats.total} />
        <StatCard label="Admin" value={stats.admin} />
        <StatCard label="HR" value={stats.hr} />
        <StatCard label="Employee" value={stats.employee} />
        <StatCard label="Belum Terkait Pegawai" value={stats.unlinked} />
        <StatCard label="Perlu Tindakan Admin" value={stats.conflict} />
      </div>

      <div className="page-panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari username, email, role, pegawai..."
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="all">Semua Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Username</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Pegawai</th>
                <th className="px-3 py-3">Status Relasi</th>
                <th className="px-3 py-3">Dibuat</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-slate-500"
                    colSpan={7}
                  >
                    Data user tidak ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">
                      {user.username}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {user.email || "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {(user.role_id && roleMap.get(user.role_id)) || "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {(user.employee_id &&
                        employeeMap.get(user.employee_id)?.nama) ||
                        "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {user.link_status === "conflict" ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Konflik
                        </span>
                      ) : user.link_status === "unlinked" ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          Belum Terkait
                        </span>
                      ) : user.link_status === "linked_auto" ? (
                        <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                          Auto-linked
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Terkait
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {toDate(user.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 md:hidden">
          {paginatedUsers.length === 0 ? (
            <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">
              Data user tidak ditemukan.
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.email || "-"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {(user.role_id && roleMap.get(user.role_id)) || "-"}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p>
                    Pegawai:{" "}
                    {(user.employee_id &&
                      employeeMap.get(user.employee_id)?.nama) ||
                      "-"}
                  </p>
                  <p>
                    Status:{" "}
                    {user.link_status === "conflict"
                      ? "Konflik"
                      : user.link_status === "linked_auto"
                        ? "Auto-linked"
                        : user.link_status === "linked_manual"
                          ? "Terkait"
                          : "Belum terkait"}
                  </p>
                  <p>Dibuat: {toDate(user.created_at)}</p>
                </div>

                {user.link_status === "conflict" && (
                  <p className="mt-2 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
                    {user.link_message ??
                      "Konflik matching. Silakan pilih relasi pegawai secara manual."}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(user)}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    className="flex-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan{" "}
            {filteredUsers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filteredUsers.length)} dari{" "}
            {filteredUsers.length} user
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-xs font-medium text-slate-600">
              Hal. {page}/{totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
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
                  disabled={Boolean(editing)}
                  onChange={(event) =>
                    handleFieldChange("username", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("username")}
                  placeholder="Username"
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-slate-400 disabled:bg-slate-100 ${
                    fieldErrors.username
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                />
                {fieldErrors.username && (
                  <p className="text-xs text-red-600">{fieldErrors.username}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NIP{" "}
                  <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <input
                  value={form.nip}
                  onChange={(event) =>
                    handleFieldChange("nip", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("nip")}
                  placeholder="Nomor Induk Pegawai"
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-slate-400 ${
                    fieldErrors.nip
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
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
                    onChange={(event) =>
                      handleFieldChange("password", event.target.value)
                    }
                    onBlur={() => handleFieldBlur("password")}
                    placeholder="Password"
                    className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-slate-400 ${
                      fieldErrors.password
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="text-xs text-red-600">
                      {fieldErrors.password}
                    </p>
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
                  onChange={(event) =>
                    handleFieldChange("email", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="Email"
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-slate-400 ${
                    fieldErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
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
                  onChange={(event) =>
                    handleFieldChange("role_id", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("role_id")}
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-slate-400 ${
                    fieldErrors.role_id
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
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
                  onChange={(event) =>
                    handleFieldChange("employee_id", event.target.value)
                  }
                  onBlur={() => handleFieldBlur("employee_id")}
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
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
                          : "text-cyan-700"
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
                onClick={() => {
                  if (saving) return;
                  setFormOpen(false);
                  setEditing(null);
                  setForm(initialForm);
                  setFieldErrors({});
                  setTouched({});
                  setEmployeeTouchedManual(false);
                  setAutoLinkHint("");
                }}
                className="h-10 rounded-lg border border-red-500 bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || !isFormValid}
                className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
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
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900">
              Hapus User
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Yakin ingin menghapus user{" "}
              <strong>{deleteTarget.username}</strong>?
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className="h-10 rounded-lg border border-red-500 bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300 disabled:border-red-300 disabled:text-red-100 disabled:hover:bg-red-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-red-100 disabled:hover:bg-red-300"
              >
                {saving ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="page-panel p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
