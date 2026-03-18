"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import UserStats from "@/components/users/UserStats";
import UsersToolbar from "@/components/users/UsersToolbar";
import UsersTable from "@/components/users/UsersTable";
import UserDeleteModal from "@/components/users/UserDeleteModal";
import UserFormModal from "@/components/users/UserFormModal";
import UsersTableFilters from "@/components/users/UsersTableFilters";
import type {
  EmployeeItem,
  RoleItem,
  UserFormErrors,
  UserFormState,
  UserItem,
} from "@/components/users/types";
import { JwtPayload } from "@/lib/jwt";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_REGEX,
  NIP_MAX_LENGTH,
  NIP_MIN_LENGTH,
  NIP_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
  isValidUuid,
} from "@/lib/validations/userRules";

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
  } else if (!USERNAME_REGEX.test(form.username.trim())) {
    errors.username =
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip.";
  } else if (form.username.trim().length < USERNAME_MIN_LENGTH) {
    errors.username = "Username minimal 3 karakter";
  } else if (form.username.trim().length > USERNAME_MAX_LENGTH) {
    errors.username = "Username maksimal 100 karakter";
  }

  if (!form.nip.trim()) {
    errors.nip = "NIP wajib diisi.";
  } else if (!NIP_REGEX.test(form.nip.trim())) {
    errors.nip = "NIP hanya boleh berisi angka.";
  } else if (form.nip.trim().length < NIP_MIN_LENGTH) {
    errors.nip = "NIP minimal 8 digit.";
  } else if (form.nip.trim().length > NIP_MAX_LENGTH) {
    errors.nip = "NIP maksimal 50 digit.";
  }

  if (!isEditing) {
    if (!form.password.trim()) {
      errors.password = "Password wajib diisi.";
    } else if (form.password.length < PASSWORD_MIN_LENGTH) {
      errors.password = "Password minimal 8 karakter.";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      errors.password =
        "Password harus mengandung huruf dan angka tanpa spasi.";
    }
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (form.email.trim().length > EMAIL_MAX_LENGTH) {
    errors.email = "Email maksimal 150 karakter.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.role_id) {
    errors.role_id = "Role wajib dipilih.";
  } else if (!isValidUuid(form.role_id)) {
    errors.role_id = "Format role tidak valid.";
  }

  if (form.employee_id && !isValidUuid(form.employee_id)) {
    errors.employee_id = "Format pegawai tidak valid.";
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
            nip: form.nip.trim(),
            email: form.email.trim(),
            role_id: form.role_id.trim(),
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
            nip: form.nip.trim(),
            email: form.email.trim(),
            role_id: form.role_id.trim(),
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

  async function handleDelete(id: string) {
    if (!id) return;

    setSaving(true);
    try {
      await apiFetch(`/api/user/${id}`, { method: "DELETE" });
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
      <UsersToolbar onAdd={openCreateModal} />
      <UserStats stats={stats} />

      <div className="page-panel rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <UsersTableFilters
          search={search}
          roleFilter={roleFilter}
          roles={roles}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
        />

        <UsersTable
          rows={paginatedUsers}
          roleMap={roleMap}
          employeeMap={employeeMap}
          toDate={toDate}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
        />
        {/* ...existing mobile list + pagination... */}
      </div>

      <UserDeleteModal
        open={!!deleteTarget}
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <UserFormModal
        open={formOpen}
        editing={Boolean(editing)}
        saving={saving}
        form={form}
        fieldErrors={fieldErrors}
        roles={roles}
        employees={employees}
        autoLinkHint={autoLinkHint}
        isFormValid={isFormValid}
        onChangeField={handleFieldChange}
        onBlurField={handleFieldBlur}
        onClose={() => {
          if (saving) return;
          setFormOpen(false);
          setEditing(null);
          setForm(initialForm);
          setFieldErrors({});
          setTouched({});
          setEmployeeTouchedManual(false);
          setAutoLinkHint("");
        }}
        onSubmit={handleSubmit}
      />

      {/* HAPUS blok modal form inline lama */}
      {/* HAPUS blok modal delete inline lama */}
    </div>
  );
}
