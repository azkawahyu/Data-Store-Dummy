"use client";

import type { DocumentStatus } from "./types";

type SortValue = "newest" | "oldest" | "az" | "za";

interface Props {
  search: string;
  status: "all" | DocumentStatus;
  docType: string;
  sort: SortValue;
  docTypeOptions: string[];
  loading?: boolean;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: "all" | DocumentStatus) => void;
  onDocTypeChange: (v: string) => void;
  onSortChange: (v: SortValue) => void;
  onRefresh: () => void;
}

export default function DocumentsTableFilters({
  search,
  status,
  docType,
  sort,
  docTypeOptions,
  loading = false,
  onSearchChange,
  onStatusChange,
  onDocTypeChange,
  onSortChange,
  onRefresh,
}: Props) {
  return (
    <div className="mb-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_180px_220px_160px_auto]">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari nama pegawai / nama file..."
        className="input"
      />

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value as "all" | DocumentStatus)
        }
        className="select"
      >
        <option value="all">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="verified">Disetujui</option>
        <option value="rejected">Ditolak</option>
      </select>

      <select
        value={docType}
        onChange={(e) => onDocTypeChange(e.target.value)}
        className="select"
      >
        <option value="">Semua Jenis Dokumen</option>
        {docTypeOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortValue)}
        className="select"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="az">Nama A-Z</option>
        <option value="za">Nama Z-A</option>
      </select>

      {/* <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Memuat..." : "Refresh"}
      </button> */}
    </div>
  );
}
