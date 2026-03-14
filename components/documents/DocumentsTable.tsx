"use client";

import DocumentStatusBadge from "./DocumentStatusBadge";
import { DocumentItem } from "./types";

interface Props {
  rows: DocumentItem[];
  canManage: boolean;
  onView: (doc: DocumentItem) => void;
  onVerify: (doc: DocumentItem) => void;
  onReject: (doc: DocumentItem) => void;
}

export default function DocumentsTable({
  rows,
  canManage,
  onView,
  onVerify,
  onReject,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        overflow: "hidden",
        background: "white",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr 1fr 0.9fr 0.9fr 1.2fr",
          gap: 8,
          padding: "10px 12px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <div>Pegawai</div>
        <div>Tipe</div>
        <div>File</div>
        <div>Uploaded</div>
        <div>Status</div>
        <div>Aksi</div>
      </div>

      {rows.map((d) => (
        <div
          key={d.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr 1fr 0.9fr 0.9fr 1.2fr",
            gap: 8,
            padding: "10px 12px",
            borderBottom: "1px solid #f1f5f9",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          <div>{d.employeeName}</div>
          <div>{d.documentType}</div>
          <div
            title={d.fileName}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {d.fileName}
          </div>
          <div>{new Date(d.uploadedAt).toLocaleDateString("id-ID")}</div>
          <div>
            <DocumentStatusBadge status={d.status} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => onView(d)}>View</button>
            {canManage && d.status === "pending" && (
              <>
                <button onClick={() => onVerify(d)}>Verify</button>
                <button onClick={() => onReject(d)}>Reject</button>
              </>
            )}
          </div>
        </div>
      ))}

      {rows.length === 0 && (
        <div style={{ padding: 14, color: "#64748b" }}>
          Belum ada data dokumen.
        </div>
      )}
    </div>
  );
}
