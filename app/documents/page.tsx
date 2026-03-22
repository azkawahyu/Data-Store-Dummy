"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentDetailModal from "@/components/documents/DocumentDetailModal";
import DocumentsStats from "@/components/documents/DocumentsStats";
import DocumentsTable from "@/components/documents/DocumentsTable";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import DocumentDeleteModal from "@/components/documents/DocumentDeleteModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { DocumentItem, DocumentStatus } from "@/components/documents/types";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import DocumentsTableFilters from "@/components/documents/DocumentsTableFilters";

type SortValue = "newest" | "oldest" | "az" | "za";

const PAGE_SIZE = 7;

export default function DocumentsPage() {
  const [rows, setRows] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | DocumentStatus>("all");
  const [docType, setDocType] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");

  const [openDetail, setOpenDetail] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);

  // pagination
  const [page, setPage] = useState(1);

  const router = useRouter();
  const toast = useToast();

  interface JwtPayload {
    userId?: string;
    sub?: string;
    role?: string;
    [key: string]: unknown;
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
          const id = payload.userId ?? payload.sub;
          setUserId(id ? String(id) : null);

          const role = String(payload.role ?? "")
            .trim()
            .toLowerCase();
          const isManager = role === "admin" || role === "hr";

          setCanManage(isManager);
          setCanDelete(role === "admin");
        }

        const data = await apiFetch("/api/documents");

        const list = (
          Array.isArray(data) ? data : (data?.data ?? [])
        ) as RawDocument[];
        type RawDocument = {
          id?: string;
          _id?: string;
          employee_id?: string;
          employeeId?: string;
          employee_name?: string;
          employeeName?: string;
          employee_name_full?: string;
          employee_full_name?: string;
          document_type?: string;
          documentType?: string;
          file_name?: string;
          fileName?: string;
          file_size?: number | string | null;
          fileSize?: number | string | null;
          file_path?: string;
          filePath?: string;
          mime_type?: string;
          mimeType?: string;
          uploaded_at?: string;
          uploadedAt?: string;
          status?: DocumentStatus | string;
          verified_by?: string;
          verifiedBy?: string;
          verified_by_name?: string;
          verifiedByName?: string;
          verified_at?: string;
          verifiedAt?: string;
          [key: string]: unknown;
        };

        const normalize = (d: RawDocument): DocumentItem => ({
          id: String(d.id ?? d._id ?? ""),
          employeeId: String(d.employee_id ?? d.employeeId ?? ""),
          employeeName:
            d.employee_name ??
            d.employeeName ??
            d.employee_name_full ??
            d.employee_full_name ??
            String(d.employee_id ?? ""),
          documentType: d.document_type ?? d.documentType ?? "",
          fileName: d.file_name ?? d.fileName ?? "",
          fileSize:
            typeof d.file_size === "number"
              ? d.file_size
              : typeof d.fileSize === "number"
                ? d.fileSize
                : typeof d.file_size === "string"
                  ? Number(d.file_size)
                  : typeof d.fileSize === "string"
                    ? Number(d.fileSize)
                    : null,
          filePath: d.file_path ?? d.filePath ?? "",
          mimeType: d.mime_type ?? d.mimeType ?? "",
          uploadedAt: d.uploaded_at ?? d.uploadedAt ?? new Date().toISOString(),
          status: (d.status ?? "pending") as DocumentStatus,
          verifiedBy:
            d.verified_by ??
            (d as { verifiedBy?: string }).verifiedBy ??
            undefined,
          verifiedByName: d.verified_by_name ?? d.verifiedByName ?? undefined,
          verifiedAt: d.verified_at ?? d.verifiedAt ?? undefined,
        });

        setRows(list.map(normalize));
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  useEffect(() => {}, [canManage]);

  const docTypeOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.documentType ?? "")))
        .filter(Boolean)
        .sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const out = rows.filter((r) => {
      const emp = (r.employeeName ?? "").toLowerCase();
      const docT = (r.documentType ?? "").toLowerCase();
      const fname = (r.fileName ?? "").toLowerCase();
      const matchQ = emp.includes(q) || docT.includes(q) || fname.includes(q);
      const rStatus = (r.status ?? "").toString().toLowerCase();
      const matchStatus =
        status === "all" || rStatus === String(status).toLowerCase();
      const matchType =
        !docType ||
        (r.documentType ?? "").toString().trim() === docType.toString().trim();
      return matchQ && matchStatus && matchType;
    });

    out.sort((a, b) => {
      if (sort === "newest")
        return +new Date(b.uploadedAt) - +new Date(a.uploadedAt);
      if (sort === "oldest")
        return +new Date(a.uploadedAt) - +new Date(b.uploadedAt);
      if (sort === "az")
        return (a.employeeName ?? "").localeCompare(b.employeeName ?? "", "id");
      return (b.employeeName ?? "").localeCompare(a.employeeName ?? "", "id");
    });

    return out;
  }, [rows, debouncedSearch, status, docType, sort]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, docType, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const selectedDocuments = useMemo(
    () => rows.filter((r) => selectedIds.includes(r.id)),
    [rows, selectedIds],
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const verified = rows.filter((r) => r.status === "verified").length;
    const rejected = rows.filter((r) => r.status === "rejected").length;
    return { total, pending, verified, rejected };
  }, [rows]);

  async function updateStatus(doc: DocumentItem, next: DocumentStatus) {
    // Confirm action
    const actionLabel = next === "verified" ? "verifikasi" : "penolakan";
    if (!confirm(`Yakin ingin melakukan ${actionLabel} pada dokumen ini?`))
      return;

    const prevRows = [...rows];

    // compute verifier id (from state or token)
    let verifiedBy = userId;
    if (!verifiedBy) {
      const token = localStorage.getItem("token");
      const payload = token ? parseJwt(token) : null;
      verifiedBy = payload ? String(payload.userId ?? payload.sub ?? "") : null;
    }

    if (!verifiedBy) {
      toast.push(
        "Anda harus login untuk melakukan verifikasi/penolakan.",
        "error",
      );
      return;
    }

    // optimistic update (include verifier id)
    setRows((prev) =>
      prev.map((r) =>
        r.id === doc.id
          ? {
              ...r,
              status: next,
              verifiedBy: verifiedBy,
              verifiedAt: new Date().toISOString(),
              verifiedByName: next === "verified" ? "Anda" : r.verifiedByName,
            }
          : r,
      ),
    );

    setSelected((prev) =>
      prev && prev.id === doc.id
        ? {
            ...prev,
            status: next,
            verifiedBy: verifiedBy,
            verifiedAt: new Date().toISOString(),
            verifiedByName: next === "verified" ? "Anda" : prev.verifiedByName,
          }
        : prev,
    );

    try {
      const endpoint = next === "verified" ? "verify" : "reject";

      const res = await apiFetch(`/api/documents/${endpoint}/${doc.id}`, {
        method: "PATCH",
        body: JSON.stringify({ verified_by: verifiedBy }),
      });

      if (!res || !res.success) {
        setRows(prevRows);
        const msg =
          typeof res?.message === "string"
            ? res?.message
            : JSON.stringify(res?.message ?? "");
        toast.push(msg || "Gagal memperbarui status dokumen", "error");
        return;
      }

      const d = res.data;

      // update from server response (ensures consistent fields)
      setRows((prev) =>
        prev.map((r) =>
          r.id === (d?.id ?? doc.id)
            ? {
                ...r,
                status: d?.status ?? next,
                verifiedBy: d?.verified_by ?? verifiedBy,
                verifiedAt: d?.verified_at ?? new Date().toISOString(),
                verifiedByName:
                  d?.verified_by_name ??
                  (verifiedBy === userId ? "Anda" : r.verifiedByName),
              }
            : r,
        ),
      );

      setSelected((prev) =>
        prev && prev.id === (d?.id ?? doc.id)
          ? {
              ...prev,
              status: d?.status ?? next,
              verifiedBy: d?.verified_by ?? verifiedBy,
              verifiedAt: d?.verified_at ?? new Date().toISOString(),
              verifiedByName:
                d?.verified_by_name ??
                (verifiedBy === userId ? "Anda" : prev.verifiedByName),
            }
          : prev,
      );

      toast.push(
        `Dokumen berhasil ${next === "verified" ? "diverifikasi" : "ditolak"}`,
        "success",
      );
    } catch (error) {
      console.error("Error updating document status:", error);
      setRows(prevRows);
      const msg =
        error && typeof error === "object"
          ? JSON.stringify(error)
          : String(error ?? "");
      toast.push(
        msg ||
          "Terjadi kesalahan saat memperbarui status dokumen. Silakan coba lagi.",
        "error",
      );
    }
  }

  async function batchUpdateStatus(ids: string[], next: DocumentStatus) {
    if (!ids || ids.length === 0) return;
    const actionLabel = next === "verified" ? "verifikasi" : "penolakan";
    if (
      !confirm(
        `Yakin ingin melakukan ${actionLabel} pada ${ids.length} dokumen?`,
      )
    )
      return;

    const prevRows = [...rows];

    // compute verifier id
    let verifiedBy = userId;
    if (!verifiedBy) {
      const token = localStorage.getItem("token");
      const payload = token ? parseJwt(token) : null;
      verifiedBy = payload ? String(payload.userId ?? payload.sub ?? "") : null;
    }

    if (!verifiedBy) {
      toast.push(
        "Anda harus login untuk melakukan verifikasi/penolakan.",
        "error",
      );
      return;
    }

    // optimistic update for all ids
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: next,
              verifiedBy: verifiedBy,
              verifiedAt: new Date().toISOString(),
              verifiedByName: next === "verified" ? "Anda" : r.verifiedByName,
            }
          : r,
      ),
    );

    setSelected((prev) =>
      prev && ids.includes(prev.id)
        ? {
            ...prev,
            status: next,
            verifiedBy: verifiedBy,
            verifiedAt: new Date().toISOString(),
            verifiedByName: next === "verified" ? "Anda" : prev.verifiedByName,
          }
        : prev,
    );

    const failed: string[] = [];

    for (const id of ids) {
      try {
        const endpoint = next === "verified" ? "verify" : "reject";
        const res = await apiFetch(`/api/documents/${endpoint}/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ verified_by: verifiedBy }),
        });

        if (!res || !res.success) {
          failed.push(id);
          continue;
        }

        const d = res.data;
        // apply server response for that id
        setRows((prev) =>
          prev.map((r) =>
            r.id === (d?.id ?? id)
              ? {
                  ...r,
                  status: d?.status ?? next,
                  verifiedBy: d?.verified_by ?? verifiedBy,
                  verifiedAt: d?.verified_at ?? new Date().toISOString(),
                  verifiedByName:
                    d?.verified_by_name ??
                    (verifiedBy === userId ? "Anda" : r.verifiedByName),
                }
              : r,
          ),
        );
      } catch (error) {
        failed.push(id);
      }
    }

    if (failed.length > 0) {
      // revert failed ones
      setRows((prev) =>
        prev.map((r) =>
          failed.includes(r.id)
            ? (prevRows.find((pr) => pr.id === r.id) ?? r)
            : r,
        ),
      );
      toast.push(
        `${failed.length} dokumen gagal diperbarui. Sisanya diproses.`,
        "error",
      );
    } else {
      toast.push(
        `${ids.length} dokumen berhasil ${next === "verified" ? "diverifikasi" : "ditolak"}`,
        "success",
      );
      setSelectedIds([]);
    }
  }

  function handleEditDocument(doc: DocumentItem) {
    setSelected(doc);
    setOpenDetail(true);
  }

  function askDeleteDocument(doc: DocumentItem) {
    setDeleteTarget(doc);
    setDeleteOpen(true);
  }

  async function handleDeleteDocument(id: string) {
    await apiFetch(`/api/documents/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    toast.push("Dokumen berhasil dihapus", "success");
  }

  function handleBulkDownload() {
    if (selectedDocuments.length === 0) {
      toast.push("Pilih dokumen terlebih dahulu", "error");
      return;
    }

    const readyToDownload = selectedDocuments.filter((d) =>
      Boolean(d.filePath),
    );

    if (readyToDownload.length === 0) {
      toast.push(
        "Dokumen terpilih tidak memiliki file yang bisa diunduh",
        "error",
      );
      return;
    }

    for (const [index, doc] of readyToDownload.entries()) {
      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = doc.filePath;
        link.download = doc.fileName || `dokumen-${doc.id}`;
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 180);
    }

    toast.push(
      `Memulai download ${readyToDownload.length} dokumen. Jika browser meminta izin, pilih Allow.`,
      "success",
    );
  }

  function loadData() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="page-shell">
      <DocumentsToolbar
        search={search}
        status={status}
        docType={docType}
        sort={sort}
        docTypeOptions={docTypeOptions}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDocTypeChange={setDocType}
        onSortChange={setSort}
        onUpload={() => setOpenUpload(true)}
      />

      <DocumentsStats
        total={stats.total}
        pending={stats.pending}
        verified={stats.verified}
        rejected={stats.rejected}
      />

      <div className="card">
        <DocumentsTableFilters
          search={search}
          status={status}
          docType={docType}
          sort={sort}
          docTypeOptions={docTypeOptions}
          loading={loading}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onDocTypeChange={setDocType}
          onSortChange={setSort}
          onRefresh={() => {
            setLoading(true);
            void loadData(); // ganti jika nama fungsi fetch Anda berbeda
          }}
        />

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            {selectedIds.length > 0
              ? `${selectedIds.length} dokumen dipilih`
              : "Pilih dokumen untuk download massal"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
              className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Pilihan
            </button>
            {canManage && (
              <>
                <button
                  onClick={() =>
                    void batchUpdateStatus(selectedIds, "verified")
                  }
                  disabled={selectedIds.length === 0}
                  className="rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Verifikasi Terpilih
                </button>
                <button
                  onClick={() =>
                    void batchUpdateStatus(selectedIds, "rejected")
                  }
                  disabled={selectedIds.length === 0}
                  className="rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tolak Terpilih
                </button>
              </>
            )}
            <button
              onClick={handleBulkDownload}
              disabled={selectedIds.length === 0}
              className="rounded border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download Terpilih
            </button>
          </div>
        </div>

        <DocumentsTable
          rows={paginatedRows}
          canManage={canManage}
          canDelete={canDelete}
          selectedIds={selectedIds}
          onSelectionChange={(ids) => setSelectedIds(ids)}
          onView={(d) => {
            setSelected(d);
            setOpenDetail(true);
          }}
          onVerify={(d) => updateStatus(d, "verified")}
          onReject={(d) => updateStatus(d, "rejected")}
          onEdit={handleEditDocument}
          onDelete={askDeleteDocument}
        />

        <div className="documents-pagination mt-4 flex items-center justify-between gap-4 border-t border-slate-200 px-1 pt-4">
          <p className="documents-pagination-info text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-medium text-slate-700">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-700">
              {filtered.length}
            </span>{" "}
            dokumen
          </p>

          <div className="documents-pagination-buttons flex items-center gap-1">
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
                    className="px-2 text-xs text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`rounded border px-2.5 py-1 text-xs ${
                      page === p
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
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

      <DocumentDetailModal
        open={openDetail}
        data={selected}
        onClose={() => setOpenDetail(false)}
        canManage={canManage}
        onVerify={(d) => updateStatus(d, "verified")}
        onReject={(d) => updateStatus(d, "rejected")}
      />

      <UploadDocumentModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={() => {
          setLoading(true);
          setTimeout(async () => {
            try {
              const data = await apiFetch("/api/documents");
              type RawDocument = {
                id?: string;
                _id?: string;
                employee_id?: string;
                employeeId?: string;
                employee_name?: string;
                employeeName?: string;
                employee_name_full?: string;
                employee_full_name?: string;
                document_type?: string;
                documentType?: string;
                file_name?: string;
                fileName?: string;
                file_path?: string;
                filePath?: string;
                mime_type?: string;
                mimeType?: string;
                uploaded_at?: string;
                uploadedAt?: string;
                status?: DocumentStatus | string;
                verified_by?: string;
                verifiedBy?: string;
                verified_by_name?: string;
                verifiedByName?: string;
                verified_at?: string;
                verifiedAt?: string;
                [key: string]: unknown;
              };
              const list = (
                Array.isArray(data) ? data : (data?.data ?? [])
              ) as RawDocument[];
              const normalize = (d: RawDocument): DocumentItem => ({
                id: String(d.id ?? d._id ?? ""),
                employeeId: String(d.employee_id ?? d.employeeId ?? ""),
                employeeName:
                  d.employee_name ??
                  d.employeeName ??
                  d.employee_name_full ??
                  d.employee_full_name ??
                  String(d.employee_id ?? ""),
                documentType: d.document_type ?? d.documentType ?? "",
                fileName: d.file_name ?? d.fileName ?? "",
                filePath: d.file_path ?? d.filePath ?? "",
                mimeType: d.mime_type ?? d.mimeType ?? "",
                uploadedAt:
                  d.uploaded_at ?? d.uploadedAt ?? new Date().toISOString(),
                status: (d.status ?? "pending") as DocumentStatus,
                verifiedBy: d.verified_by ?? d.verifiedBy ?? undefined,
                verifiedByName:
                  d.verified_by_name ?? d.verifiedByName ?? undefined,
                verifiedAt: d.verified_at ?? d.verifiedAt ?? undefined,
              });
              setRows(list.map(normalize));
            } catch (e) {
              setRows([]);
            } finally {
              setLoading(false);
            }
          }, 500);
        }}
      />

      <DocumentDeleteModal
        open={deleteOpen}
        doc={deleteTarget}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteDocument}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        title="Hapus Dokumen"
        description={
          deleteTarget
            ? `Anda akan menghapus "${deleteTarget.fileName}". Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await handleDeleteDocument(deleteTarget.id);
        }}
      />
    </div>
  );
}
