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
  onUpload: () => void;
}

export default function DocumentsToolbar(props: Props) {
  return (
    <div className="header-card p-4 sm:p-6" style={{ marginBottom: 16 }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="min-w-0">
          <h2 className="page-title">Data Dokumen</h2>
          <p className="page-subtitle">Kelola dokumen pegawai</p>
        </div>
        <button
          onClick={props.onUpload}
          className="btn btn-accent w-full sm:w-auto"
        >
          + Upload Dokumen
        </button>
      </div>
    </div>
  );
}
