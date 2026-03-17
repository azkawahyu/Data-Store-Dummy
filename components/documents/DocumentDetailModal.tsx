"use client";

import DocumentStatusBadge from "./DocumentStatusBadge";
import { DocumentItem } from "./types";

interface Props {
  open: boolean;
  data: DocumentItem | null;
  onClose: () => void;
  canManage?: boolean;
  onVerify?: (doc: DocumentItem) => void;
  onReject?: (doc: DocumentItem) => void;
}

export default function DocumentDetailModal({
  open,
  data,
  onClose,
  canManage,
  onVerify,
  onReject,
}: Props) {
  if (!open || !data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0 }}>Detail Dokumen</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Pegawai:</b> {data.employeeName}
          </div>
          <div>
            <b>Tipe:</b> {data.documentType}
          </div>
          <div>
            <b>File:</b> {data.fileName}
          </div>
          <div>
            <b>Status:</b> <DocumentStatusBadge status={data.status} />
          </div>
          <div>
            <b>Upload:</b>{" "}
            {new Date(data.uploadedAt).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            })}
          </div>
          <div>
            <b>Diverifikasi oleh:</b> {data.verifiedByName ?? "-"}
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <a href={data.filePath} target="_blank" rel="noopener noreferrer">
            Buka File
          </a>

          {data && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {canManage && onVerify && (
                <button
                  onClick={async () => {
                    try {
                      await onVerify(data);
                    } catch (e) {
                      console.error(e);
                    }
                    onClose();
                  }}
                >
                  Verify
                </button>
              )}

              {canManage && onReject && (
                <button
                  onClick={async () => {
                    try {
                      await onReject(data);
                    } catch (e) {
                      console.error(e);
                    }
                    onClose();
                  }}
                >
                  Reject
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
