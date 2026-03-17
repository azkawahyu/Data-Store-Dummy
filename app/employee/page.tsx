"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Employee, EmployeeForm } from "@/types/employee";
import EmployeeStats from "@/components/employee/EmployeeStats";
import EmployeeToolbar from "@/components/employee/EmployeeToolbar";
import EmployeeTable from "@/components/employee/EmployeeTable";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import EmployeeDeleteModal from "@/components/employee/EmployeeDeleteModal";

function parseJwt(token: string) {
  try {
    const p = token.split(".")[1];
    if (!p) return null;
    return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export default function EmployeePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterUnit, setFilterUnit] = useState("");
  const [canManage, setCanManage] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        if (payload) {
          const role = (payload.role ?? "").toString().toLowerCase();
          setCanManage(role === "admin" || role === "hr");
        }

        const data = await apiFetch("/api/employees");
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const unitOptions = useMemo(
    () => Array.from(new Set(employees.map((e) => e.unit))).sort(),
    [employees],
  );

  const displayed = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    const filtered = employees.filter((emp) => {
      const matchSearch =
        emp.nama?.toLowerCase().includes(keyword) ||
        emp.nip?.toLowerCase().includes(keyword) ||
        emp.jabatan?.toLowerCase().includes(keyword) ||
        emp.unit?.toLowerCase().includes(keyword) ||
        emp.email?.toLowerCase().includes(keyword);
      const matchUnit = filterUnit ? emp.unit === filterUnit : true;
      return matchSearch && matchUnit;
    });

    filtered.sort((a, b) => {
      const cmp = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [employees, debouncedSearch, sortOrder, filterUnit]);

  // ── Handlers ──
  function handleAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function handleEdit(emp: Employee) {
    setEditTarget(emp);
    setFormOpen(true);
  }

  function handleDelete(emp: Employee) {
    setDeleteTarget(emp);
    setDeleteOpen(true);
  }

  async function handleFormSubmit(form: EmployeeForm) {
    const token = localStorage.getItem("token");

    // console.log("Token:", token);

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = parseJwt(token);
    if (payload) {
      const id = payload.userId ?? payload.sub ?? payload.userId;
      setUserId(id ? String(id) : null);
      const role = (payload.role ?? "").toString().toLowerCase();
      setCanManage(role === "admin" || role === "hr");
    }

    console.log(editTarget);

    if (editTarget) {
      // Edit
      const updated = await apiFetch(`/api/employees/${editTarget.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setEmployees((prev) =>
        prev.map((e) => (e.id === editTarget.id ? { ...e, ...updated } : e)),
      );
    } else {
      // Tambah
      const created = await apiFetch("/api/employees", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setEmployees((prev) => [...prev, created]);
    }
  }

  async function handleDeleteConfirm(id: string) {
    await apiFetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) {
    return (
      <div style={{ padding: 24, color: "#64748b" }}>
        Memuat data pegawai...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gap: 16 }}>
        {/* Title */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 700,
            }}
          >
            Data Pegawai
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
            Kelola seluruh data pegawai perusahaan
          </p>
        </div>

        {/* Stats */}
        <EmployeeStats employees={employees} />

        {/* Toolbar */}
        <EmployeeToolbar
          search={search}
          onSearch={setSearch}
          filterUnit={filterUnit}
          onFilterUnit={setFilterUnit}
          sortOrder={sortOrder}
          onSortOrder={setSortOrder}
          unitOptions={unitOptions}
          canManage={canManage}
          onAdd={handleAdd}
        />

        {/* Table */}
        <EmployeeTable
          employees={displayed}
          canManage={canManage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Form Tambah/Edit */}
      <EmployeeFormModal
        open={formOpen}
        initial={editTarget}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Modal Konfirmasi Hapus */}
      <EmployeeDeleteModal
        open={deleteOpen}
        employee={deleteTarget}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
