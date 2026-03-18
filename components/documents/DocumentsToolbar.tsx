"use client";

import { DocumentStatus } from "./types";

type SortValue = "newest" | "oldest" | "az" | "za";

interface Props {
  search: string;
  status: "all" | DocumentStatus;
  docType: string;
  sort: SortValue;
  docTypeOptions: string[];
  onSearchChange: (v: string) => void;
  onStatusChange: (v: "all" | DocumentStatus) => void;
  onDocTypeChange: (v: string) => void;
  onSortChange: (v: SortValue) => void;
}

export default function DocumentsToolbar(props: Props) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .documents-toolbar {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .documents-toolbar {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>

      <div
        className="documents-toolbar"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input
          placeholder="Cari nama pegawai / dokumen..."
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "9px 10px",
            width: "100%",
          }}
        />

        <select
          value={props.status}
          onChange={(e) =>
            props.onStatusChange(e.target.value as "all" | DocumentStatus)
          }
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "9px 10px",
            width: "100%",
          }}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>

        <select
          value={props.docType}
          onChange={(e) => props.onDocTypeChange(e.target.value)}
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "9px 10px",
            width: "100%",
          }}
        >
          <option value="">Semua Tipe</option>
          {props.docTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={props.sort}
          onChange={(e) => props.onSortChange(e.target.value as SortValue)}
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "9px 10px",
            width: "100%",
          }}
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="az">Nama A-Z</option>
          <option value="za">Nama Z-A</option>
        </select>
      </div>
    </>
  );
}
