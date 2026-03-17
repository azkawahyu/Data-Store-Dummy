"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentDetailModal from "@/components/documents/DocumentDetailModal";
import DocumentsStats from "@/components/documents/DocumentsStats";
import DocumentsTable from "@/components/documents/DocumentsTable";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import { DocumentItem, DocumentStatus } from "@/components/documents/types";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

type SortValue = "newest" | "oldest" | "az" | "za";

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
  const [userId, setUserId] = useState<string | null>(null);

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

        const data = await apiFetch("/api/documents");

        // console.log("Documents Data:", data);

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
  }, []);

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

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <style>{`
        @media (max-width: 768px) {
          .documents-page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
          .documents-page-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .documents-page-actions button {
            width: 100%;
          }
        }
      `}</style>

      <header className="documents-page-header flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Dokumen Pegawai
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola dokumen pegawai dengan mudah.
          </p>
        </div>

        <div className="documents-page-actions flex items-center gap-3">
          <button
            onClick={() => setOpenUpload(true)}
            className="bg-slate-800 text-white px-3 py-2 rounded-md text-sm"
          >
            Upload Dokumen
          </button>
          {canManage && selectedIds.length > 0 && (
            <>
              <button
                onClick={() => batchUpdateStatus(selectedIds, "verified")}
                className="bg-green-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Verify Selected ({selectedIds.length})
              </button>
              <button
                onClick={() => batchUpdateStatus(selectedIds, "rejected")}
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Reject Selected ({selectedIds.length})
              </button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <DocumentsStats {...stats} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white shadow-sm rounded-lg p-4">
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
            />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-4">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-slate-500">
                Memuat...
              </div>
            ) : (
              <DocumentsTable
                rows={filtered}
                canManage={canManage}
                selectedIds={selectedIds}
                onSelectionChange={(ids) => setSelectedIds(ids)}
                onView={(d) => {
                  setSelected(d);
                  setOpenDetail(true);
                }}
                onVerify={(d) => updateStatus(d, "verified")}
                onReject={(d) => updateStatus(d, "rejected")}
              />
            )}
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
    </div>
  );
}
