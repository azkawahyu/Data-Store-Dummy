"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import type { Employee, EmployeeForm } from "@/types/employee";
import EmployeeStats from "@/components/employee/EmployeeStats";
import EmployeeToolbar from "@/components/employee/EmployeeToolbar";
import EmployeeTable from "@/components/employee/EmployeeTable";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import EmployeeDeleteModal from "@/components/employee/EmployeeDeleteModal";

const PAGE_SIZE = 8;

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
  const toast = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "asc" | "desc"
  >("newest");
  const [filterUnit, setFilterUnit] = useState("");
  const [canManage, setCanManage] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  // Pagination
  const [page, setPage] = useState(1);

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
          setCanDelete(role === "admin");
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
    () =>
      Array.from(
        new Set(
          employees
            .map((e) => String(e.unit ?? "").trim())
            .filter((unit) => unit.length > 0),
        ),
      ).sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" })),
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
      if (sortOrder === "newest")
        return +new Date(b.created_at) - +new Date(a.created_at);
      if (sortOrder === "oldest")
        return +new Date(a.created_at) - +new Date(b.created_at);
      const cmp = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [employees, debouncedSearch, sortOrder, filterUnit]);

  // Reset page saat filter/sort/search berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterUnit, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return displayed.slice(start, start + PAGE_SIZE);
  }, [displayed, page]);

  // ── Helpers ──
  async function refreshEmployees() {
    try {
      const data = await apiFetch("/api/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

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
    try {
      if (editTarget) {
        const updated = await apiFetch(`/api/employees/${editTarget.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setEmployees((prev) =>
          prev.map((e) => (e.id === editTarget.id ? { ...e, ...updated } : e)),
        );
        toast.push("Pegawai berhasil diperbarui.", "success");
        await refreshEmployees();
      } else {
        await apiFetch("/api/employees", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.push("Pegawai berhasil ditambahkan.", "success");
        await refreshEmployees();
      }
    } catch {
      toast.push("Gagal menyimpan data pegawai.", "error");
      throw new Error("Gagal menyimpan data pegawai.");
    }
  }

  async function handleDeleteConfirm(id: string) {
    try {
      await apiFetch(`/api/employees/${id}`, { method: "DELETE" });
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.push("Pegawai berhasil dihapus.", "success");
    } catch {
      toast.push("Gagal menghapus pegawai.", "error");
    }
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
      <div className="page-shell">
        {/* Header dengan tombol Tambah Pegawai */}
        <div className="header-card">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <div style={{ flex: 1 }}>
              <h2 className="page-title">Data Pegawai</h2>
              <p className="page-subtitle">
                Kelola seluruh data pegawai perusahaan
              </p>
            </div>
            {canManage && (
              <button className="btn btn-accent" onClick={handleAdd}>
                + Tambah Pegawai
              </button>
            )}
          </div>
        </div>

        <div>
          <EmployeeStats employees={employees} />
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <EmployeeToolbar
              search={search}
              onSearch={setSearch}
              filterUnit={filterUnit}
              onFilterUnit={setFilterUnit}
              sortOrder={sortOrder}
              onSortOrder={setSortOrder}
              unitOptions={unitOptions}
            />
          </div>

          <EmployeeTable
            employees={paginatedEmployees}
            canManage={canManage}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="documents-pagination mt-4 flex flex-col gap-3 border-t border-slate-200 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="documents-pagination-info text-xs text-slate-600">
              Menampilkan{" "}
              <span className="font-medium text-slate-700">
                {displayed.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, displayed.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-700">
                {displayed.length}
              </span>{" "}
              pegawai
            </p>

            <div className="documents-pagination-buttons flex flex-wrap items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Pertama"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Sebelumnya"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-slate-400 text-xs"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`px-2.5 py-1 text-xs rounded border ${
                        page === p
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Berikutnya"
              >
                ›
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Halaman Terakhir"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmployeeFormModal
        open={formOpen}
        initial={editTarget}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <EmployeeDeleteModal
        open={deleteOpen}
        employee={deleteTarget}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
