"use client";

import { apiFetch } from "@/lib/api";
import type { Employee } from "@/types/employee";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import EmployeeDetailInfo from "@/components/employee/EmployeeDetailInfo";
import ResetPasswordModal from "@/components/common/ResetPasswordModal";
import DocumentDetailModal from "@/components/documents/DocumentDetailModal";
import type { DocumentItem as DetailDocumentItem } from "@/components/documents/types";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import {
  DOCUMENT_STATUS,
  formatDocumentStatusLabel,
  getDocumentStatusTone,
  normalizeDocumentStatus,
} from "@/components/documents/status";

interface DocumentItem {
  id: string;
  file_name?: string;
  document_type?: string;
  status?: string;
  uploaded_at?: string | null;
  file_path?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  verified_by?: string | null;
  verified_by_name?: string | null;
  verified_at?: string | null;
}

type JwtPayload = {
  role?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const p = token.split(".")[1];
    if (!p) return null;
    return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DetailDocumentItem | null>(
    null,
  );
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [canResetPassword, setCanResetPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Document filter and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function formatStatus(status?: string | null) {
    return formatDocumentStatusLabel(status);
  }

  function statusTone(status?: string | null) {
    return getDocumentStatusTone(status);
  }

  function handleViewDocument(doc: DocumentItem) {
    if (!employee) return;

    setSelectedDoc({
      id: doc.id,
      employeeId: employee.id,
      employeeName: employee.nama ?? "Pegawai",
      documentType: doc.document_type ?? "-",
      fileName: doc.file_name ?? "-",
      fileSize: doc.file_size ?? null,
      filePath: doc.file_path ?? "#",
      mimeType: doc.mime_type ?? "",
      uploadedAt: doc.uploaded_at ?? new Date().toISOString(),
      status: normalizeDocumentStatus(doc.status),
      verifiedBy: doc.verified_by ?? undefined,
      verifiedByName: doc.verified_by_name ?? undefined,
      verifiedAt: doc.verified_at ?? undefined,
    });
    setOpenDetail(true);
  }

  function toggleDocumentSelection(documentId: string) {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId],
    );
  }

  function downloadFile(filePath: string, fileName: string) {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = token ? parseJwt(token) : null;
    setCanResetPassword(String(payload?.role ?? "").toLowerCase() === "admin");
  }, []);

  async function handleResetPassword() {
    if (!employee) return "";

    setResettingPassword(true);

    try {
      const res = await fetch(`/api/user/${employee.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal reset password.");
      }

      return String(data.temporaryPassword ?? "");
    } finally {
      setResettingPassword(false);
    }
  }

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter documents based on debounced search term
  const filteredDocuments = (documents ?? []).filter((doc) => {
    const searchLower = debouncedSearch.toLowerCase();
    const statusLabel = formatDocumentStatusLabel(doc.status);
    return (
      (doc.file_name?.toLowerCase() || "").includes(searchLower) ||
      (doc.document_type?.toLowerCase() || "").includes(searchLower) ||
      statusLabel.toLowerCase().includes(searchLower)
    );
  });

  const selectableFilteredDocuments = filteredDocuments.filter((doc) =>
    Boolean(doc.file_path),
  );
  const areAllFilteredSelected =
    selectableFilteredDocuments.length > 0 &&
    selectableFilteredDocuments.every((doc) =>
      selectedDocumentIds.includes(doc.id),
    );
  const selectedDocuments = documents.filter(
    (doc) => selectedDocumentIds.includes(doc.id) && doc.file_path,
  );
  const verifiedDocumentsCount = filteredDocuments.filter(
    (doc) => normalizeDocumentStatus(doc.status) === DOCUMENT_STATUS.VERIFIED,
  ).length;

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setSelectedDocumentIds((prev) =>
      prev.filter((id) => documents.some((doc) => doc.id === id)),
    );
  }, [documents]);

  function toggleSelectAllFilteredDocuments() {
    const filteredIds = selectableFilteredDocuments.map((doc) => doc.id);
    setSelectedDocumentIds((prev) => {
      const allSelected = filteredIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !filteredIds.includes(id));
      }

      return Array.from(new Set([...prev, ...filteredIds]));
    });
  }

  function handleBatchDownload() {
    selectedDocuments.forEach((doc, index) => {
      if (!doc.file_path) return;
      window.setTimeout(() => {
        downloadFile(doc.file_path!, doc.file_name || `dokumen-${index + 1}`);
      }, index * 150);
    });
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setEmployee(null);
          setDocuments([]);
          setLoading(false);
          return;
        }
        const emp = await apiFetch(`/api/employees/${id}`);
        setEmployee(emp ?? null);
        const docs = await apiFetch(`/api/employees/${id}/documents`);
        setDocuments(Array.isArray(docs) ? docs : (docs?.data ?? []));
      } catch {
        setEmployee(null);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-slate-500">Memuat data pegawai...</div>;
  }
  if (!employee) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-5">
        <div className="rounded-xl border bg-white p-4 text-slate-600">
          Data pegawai tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-5">
      {/* Hero Banner - use profile header-card styles */}
      <section className="header-card page-panel p-4 sm:p-6">
        <div className="page-header">
          <div className="min-w-0 flex-1">
            <h2 className="page-title text-gradient-primary mt-1">
              {employee?.nama ?? "Pegawai"}
            </h2>
            <p className="page-subtitle">
              {employee?.jabatan ?? "-"} • {employee?.email ?? "-"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.back()}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </section>

      <EmployeeDetailInfo
        employee={employee}
        canResetPassword={canResetPassword}
        resettingPassword={resettingPassword}
        onResetPassword={() => setResetOpen(true)}
      />

      <ResetPasswordModal
        open={resetOpen}
        title="Reset Password Pegawai"
        description="Password lama akan dinonaktifkan. Pegawai akan menerima password sementara untuk login pertama."
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetPassword}
      />

      {/* Dokumen Card - with filter and pagination */}
      <section className="employee-card page-panel p-4 sm:p-6">
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h3 className="employee-card-title text-gradient-primary">
              Dokumen Pegawai
            </h3>
            <p className="employee-card-subtitle">
              Daftar dokumen yang diunggah untuk pegawai ini.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-info text-xs sm:text-sm">
              Total: {documents.length}
            </span>
            <span className="badge badge-success text-xs sm:text-sm">
              Terverifikasi: {verifiedDocumentsCount}
            </span>
            <span className="badge badge-warning text-xs sm:text-sm">
              Dipilih: {selectedDocuments.length}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {filteredDocuments.length}
              </span>{" "}
              dokumen sesuai pencarian dari {documents.length} total dokumen.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleSelectAllFilteredDocuments}
                disabled={selectableFilteredDocuments.length === 0}
              >
                {areAllFilteredSelected
                  ? "Batal Pilih Semua"
                  : "Pilih Semua Hasil"}
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleBatchDownload}
                disabled={selectedDocuments.length === 0}
              >
                Download Terpilih
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input flex-1 text-sm"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-white px-3 py-2 border border-slate-200">
                Hasil: {filteredDocuments.length}
              </span>
              <span className="rounded-full bg-white px-3 py-2 border border-slate-200">
                Halaman: {currentPage}/{totalPages}
              </span>
            </div>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="employee-empty-panel">
            <div className="employee-empty-icon" aria-hidden>
              ⭳
            </div>
            <p className="employee-empty-title">
              {documents.length === 0 ? "Belum ada dokumen" : "Tidak ada hasil"}
            </p>
            <p className="employee-empty-text">
              {documents.length === 0
                ? "Dokumen yang diunggah akan tampil di sini untuk dipantau status verifikasinya."
                : "Tidak ditemukan dokumen yang sesuai dengan pencarian Anda."}
            </p>
          </div>
        ) : (
          <>
            <div className="employee-doc-wrap hidden sm:block">
              <table className="employee-doc-table">
                <thead>
                  <tr className="employee-doc-head">
                    <th className="employee-doc-th">
                      <input
                        type="checkbox"
                        checked={areAllFilteredSelected}
                        onChange={toggleSelectAllFilteredDocuments}
                        disabled={selectableFilteredDocuments.length === 0}
                      />
                    </th>
                    <th className="employee-doc-th">Nama File</th>
                    <th className="employee-doc-th">Tipe</th>
                    <th className="employee-doc-th">Tanggal Upload</th>
                    <th className="employee-doc-th">Status</th>
                    <th className="employee-doc-th">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDocuments.map((doc) => {
                    const tone = statusTone(doc.status);
                    return (
                      <tr key={doc.id} className="employee-doc-row">
                        <td className="employee-doc-cell">
                          <input
                            type="checkbox"
                            checked={selectedDocumentIds.includes(doc.id)}
                            onChange={() => toggleDocumentSelection(doc.id)}
                            disabled={!doc.file_path}
                          />
                        </td>
                        <td
                          className="employee-doc-cell employee-doc-file"
                          title={doc.file_name || "-"}
                        >
                          {doc.file_name || "-"}
                        </td>
                        <td className="employee-doc-cell">
                          {doc.document_type || "-"}
                        </td>
                        <td className="employee-doc-cell employee-doc-date">
                          {formatDate(doc.uploaded_at)}
                        </td>
                        <td className="employee-doc-cell">
                          <span
                            className="employee-status-badge"
                            style={{ background: tone.bg, color: tone.color }}
                          >
                            {formatStatus(doc.status)}
                          </span>
                        </td>
                        <td className="employee-doc-cell">
                          {doc.file_path ? (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleViewDocument(doc)}
                            >
                              Lihat
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="employee-doc-cards sm:hidden">
              {paginatedDocuments.map((doc) => {
                const tone = statusTone(doc.status);
                return (
                  <div key={doc.id} className="employee-doc-card">
                    <div className="employee-doc-card-header">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={selectedDocumentIds.includes(doc.id)}
                          onChange={() => toggleDocumentSelection(doc.id)}
                          disabled={!doc.file_path}
                        />
                        <div
                          className="employee-doc-card-title"
                          title={doc.file_name || "-"}
                        >
                          {doc.file_name || "-"}
                        </div>
                      </div>
                      <span
                        className="employee-status-badge"
                        style={{ background: tone.bg, color: tone.color }}
                      >
                        {formatStatus(doc.status)}
                      </span>
                    </div>
                    <div className="employee-doc-card-body">
                      <div className="employee-doc-card-row">
                        <span className="employee-doc-card-label">Tipe</span>
                        <span className="employee-doc-card-value">
                          {doc.document_type || "-"}
                        </span>
                      </div>
                      <div className="employee-doc-card-row">
                        <span className="employee-doc-card-label">Upload</span>
                        <span className="employee-doc-card-value">
                          {formatDate(doc.uploaded_at)}
                        </span>
                      </div>
                    </div>
                    <div className="employee-doc-card-footer">
                      {doc.file_path ? (
                        <button
                          type="button"
                          className="btn btn-secondary w-full"
                          onClick={() => handleViewDocument(doc)}
                        >
                          Lihat
                        </button>
                      ) : (
                        <span className="text-slate-400">Tidak ada file</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDocuments.length > itemsPerPage && (
              <div className="employee-pagination mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="btn btn-sm"
                >
                  Sebelumnya
                </button>
                <span className="text-xs">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-sm"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <EmployeeFormModal
        open={openEdit}
        initial={employee}
        onClose={() => setOpenEdit(false)}
        onSubmit={async () => {
          setOpenEdit(false);
        }}
        title="Edit Data Pegawai"
        submitLabel="Simpan Perubahan"
        prefillNip={employee?.nip}
        lockNip={true}
        prefillEmail={employee?.email}
        lockEmail={true}
      />

      <UploadDocumentModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={() => setOpenUpload(false)}
        defaultEmployeeId={employee.id}
        defaultEmployeeName={employee.nama ?? null}
        lockEmployeeSelection
      />

      <DocumentDetailModal
        open={openDetail}
        data={selectedDoc}
        onClose={() => setOpenDetail(false)}
        canManage={false}
      />
    </div>
  );
}
