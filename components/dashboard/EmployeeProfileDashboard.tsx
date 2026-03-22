"use client";

import { useState } from "react";
import DocumentDetailModal from "@/components/documents/DocumentDetailModal";
import type { DocumentItem } from "@/components/documents/types";
import {
  DOCUMENT_STATUS,
  formatDocumentStatusLabel,
  getDocumentStatusTone,
  normalizeDocumentStatus,
} from "@/components/documents/status";

interface EmployeeProfile {
  id: string;
  nip?: string | null;
  nama?: string | null;
  jabatan?: string | null;
  unit?: string | null;
  status?: string | null;
  email?: string | null;
  no_hp?: string | null;
}

interface AccountProfile {
  id: string;
  username?: string | null;
  nip?: string | null;
  email?: string | null;
  employee_id: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
}

interface Document {
  id: string;
  document_type: string;
  status: string;
  file_name?: string;
  file_size?: number | null;
  file_path?: string;
  mime_type?: string;
  uploaded_at?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  verified_by_name?: string | null;
}

interface Props {
  accountProfile: AccountProfile | null;
  profile: EmployeeProfile | null;
  documents: Document[];
  onUpload: () => void;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status?: string | null) {
  return formatDocumentStatusLabel(status);
}

function statusTone(status?: string | null) {
  return getDocumentStatusTone(status);
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

export default function EmployeeProfileDashboard({
  accountProfile,
  profile,
  documents,
  onUpload,
}: Props) {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const itemsPerPage = 5;

  const isProfileEmpty = !profile;
  const isProfileIncomplete = Boolean(
    profile && (!profile.nama?.trim() || !profile.nip?.trim()),
  );
  const pendingCount = documents.filter(
    (doc) => normalizeDocumentStatus(doc.status) === DOCUMENT_STATUS.PENDING,
  ).length;

  // Filter documents based on search term
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.file_name?.toLowerCase().includes(searchLower) ||
      doc.document_type?.toLowerCase().includes(searchLower) ||
      formatStatus(doc.status).toLowerCase().includes(searchLower)
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when search term changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  function toggleDocumentSelection(documentId: string) {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId],
    );
  }

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

  function handleViewDocument(doc: Document) {
    setSelectedDoc({
      id: doc.id,
      employeeId: profile?.id ?? "",
      employeeName: profile?.nama ?? "Pegawai",
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

  return (
    <div className="employee-dashboard">
      <section className="header-card page-panel p-4 sm:p-6">
        <div className="page-header">
          <div className="min-w-0 flex-1">
            <h2 className="page-title text-gradient-primary mt-1">
              Halo,{" "}
              {accountProfile?.username?.trim() ||
                profile?.nama?.trim() ||
                "Pegawai"}
            </h2>
            <p className="page-subtitle">
              Pantau akun dan dokumen pribadi Anda dalam satu halaman.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
            <span className="badge badge-info text-xs sm:text-sm">
              Total dokumen: {documents.length}
            </span>
            <span className="badge badge-warning text-xs sm:text-sm">
              Menunggu Verifikasi: {pendingCount}
            </span>
          </div>
        </div>
      </section>

      {(isProfileEmpty || isProfileIncomplete) && (
        <section className="employee-alert">
          <p className="employee-alert-title">
            Data pegawai Anda masih kosong / belum lengkap
          </p>
          <p className="employee-alert-text">
            Silakan lengkapi data pegawai terlebih dahulu agar dashboard dan
            proses dokumen berjalan optimal. Jika Anda tidak memiliki akses edit
            data, hubungi admin.
          </p>
        </section>
      )}

      <section className="employee-card page-panel p-4 sm:p-6">
        <div className="employee-card-head">
          <div className="employee-card-head-main">
            <h3 className="employee-card-title text-gradient-primary">
              Dokumen Saya
            </h3>
            <p className="employee-card-subtitle">
              Daftar dokumen yang Anda unggah
            </p>
          </div>
          <div className="employee-card-icon shrink-0" aria-hidden="true">
            📄
          </div>
        </div>

        <div className="employee-doc-toolbar">
          <p className="employee-doc-summary text-xs sm:text-sm">
            {filteredDocuments.length} dari {documents.length} dokumen
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input flex-1 text-sm"
            />
            <span className="badge badge-info text-xs sm:text-sm shrink-0">
              Terverifikasi:{" "}
              {
                filteredDocuments.filter(
                  (doc) =>
                    normalizeDocumentStatus(doc.status) ===
                    DOCUMENT_STATUS.VERIFIED,
                ).length
              }
            </span>
            <span className="badge badge-warning text-xs sm:text-sm shrink-0">
              Dipilih: {selectedDocuments.length}
            </span>
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
              className="btn btn-secondary"
              onClick={handleBatchDownload}
              disabled={selectedDocuments.length === 0}
            >
              Download Terpilih
            </button>
            <button onClick={onUpload} className="btn btn-accent" type="button">
              + Upload Dokumen
            </button>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="employee-empty-panel">
            <div className="employee-empty-icon" aria-hidden="true">
              ⭳
            </div>
            <p className="employee-empty-title">
              {documents.length === 0 ? "Belum ada dokumen" : "Tidak ada hasil"}
            </p>
            <p className="employee-empty-text">
              {documents.length === 0
                ? "Dokumen yang Anda unggah akan tampil di sini untuk dipantau status verifikasinya."
                : "Tidak ditemukan dokumen yang sesuai dengan pencarian Anda."}
            </p>
          </div>
        ) : (
          <>
            {/* Table View - Desktop Only */}
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
                            style={{
                              background: tone.bg,
                              color: tone.color,
                            }}
                          >
                            {formatStatus(doc.status)}
                          </span>
                        </td>
                        <td className="employee-doc-cell">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleViewDocument(doc)}
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card View - Mobile Only */}
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
                        style={{
                          background: tone.bg,
                          color: tone.color,
                        }}
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
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          className="btn btn-secondary w-full"
                          onClick={() => handleViewDocument(doc)}
                        >
                          Lihat Detail
                        </button>
                        {doc.file_path ? (
                          <button
                            type="button"
                            className="btn btn-accent w-full"
                            onClick={() =>
                              downloadFile(
                                doc.file_path!,
                                doc.file_name || "dokumen",
                              )
                            }
                          >
                            Download
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredDocuments.length > itemsPerPage && (
          <div className="employee-pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="employee-pagination-btn"
            >
              ← Sebelumnya
            </button>

            <div className="employee-pagination-info">
              Halaman {currentPage} dari {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="employee-pagination-btn"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </section>

      <DocumentDetailModal
        open={openDetail}
        data={selectedDoc}
        onClose={() => setOpenDetail(false)}
        canManage={false}
      />
    </div>
  );
}
