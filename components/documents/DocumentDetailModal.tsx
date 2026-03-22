"use client";

import Image from "next/image";
import { useState } from "react";
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

function getPreviewKind(filePath: string, fileName: string) {
  const source = `${filePath} ${fileName}`.toLowerCase();

  if (/(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.bmp|\.svg)(\?|$)/.test(source)) {
    return "image" as const;
  }

  if (/(\.pdf)(\?|$)/.test(source)) {
    return "pdf" as const;
  }

  return "unsupported" as const;
}

function FilePreview({
  filePath,
  fileName,
  previewKind,
}: {
  filePath: string;
  fileName: string;
  previewKind: "image" | "pdf" | "unsupported";
}) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(
    previewKind !== "unsupported",
  );
  const [hasPreviewError, setHasPreviewError] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        background: "#f8fafc",
        minHeight: 360,
        maxHeight: 460,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {previewKind === "image" && !hasPreviewError && (
        <div
          style={{
            width: "100%",
            height: 460,
            position: "relative",
            background: "#fff",
          }}
        >
          <Image
            src={filePath}
            alt={fileName}
            fill
            unoptimized
            onLoad={() => setIsPreviewLoading(false)}
            onError={() => {
              setHasPreviewError(true);
              setIsPreviewLoading(false);
            }}
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      {previewKind === "pdf" && !hasPreviewError && (
        <iframe
          src={filePath}
          title={`Preview ${fileName}`}
          onLoad={() => setIsPreviewLoading(false)}
          onError={() => {
            setHasPreviewError(true);
            setIsPreviewLoading(false);
          }}
          style={{ width: "100%", height: 460, border: "none" }}
        />
      )}

      {(previewKind === "unsupported" || hasPreviewError) && (
        <div
          style={{
            height: "100%",
            minHeight: 360,
            display: "grid",
            placeItems: "center",
            padding: 16,
            textAlign: "center",
            color: "#475569",
            fontSize: 14,
          }}
        >
          {hasPreviewError
            ? "Gagal memuat preview file. Silakan gunakan tombol Buka File."
            : "Preview belum tersedia untuk tipe file ini."}
        </div>
      )}

      {isPreviewLoading && previewKind !== "unsupported" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "rgba(248, 250, 252, 0.8)",
            color: "#334155",
            fontSize: 14,
            pointerEvents: "none",
          }}
        >
          Memuat preview...
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 8,
        alignItems: "start",
      }}
    >
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <div style={{ color: "#0f172a", fontSize: 14, wordBreak: "break-word" }}>
        {value}
      </div>
    </div>
  );
}

function getLastStatusAction(status: DocumentItem["status"]) {
  if (status === "verified") return "Diverifikasi";
  if (status === "rejected") return "Ditolak";
  return "Belum ada tindakan";
}

function formatFileSize(bytes?: number | null) {
  if (typeof bytes !== "number" || Number.isNaN(bytes) || bytes < 0) {
    return "-";
  }

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function DocumentDetailModal({
  open,
  data,
  onClose,
  canManage,
  onVerify,
  onReject,
}: Props) {
  const previewKind = data
    ? getPreviewKind(data.filePath, data.fileName)
    : "unsupported";

  const lastActionLabel = getLastStatusAction(data?.status ?? "pending");
  const lastActionBy = data?.verifiedByName ?? "-";
  const lastActionAt = data?.verifiedAt
    ? new Date(data.verifiedAt).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      })
    : "-";

  if (!open || !data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 60,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          boxShadow: "0 16px 40px rgba(2,6,23,.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18 }}>Detail Dokumen</h3>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 16,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <InfoRow label="Pegawai" value={data.employeeName} />
            <InfoRow label="Tipe Dokumen" value={data.documentType} />
            <InfoRow label="Nama File" value={data.fileName} />
            <InfoRow
              label="Ukuran File"
              value={formatFileSize(data.fileSize)}
            />
            <InfoRow
              label="Status"
              value={<DocumentStatusBadge status={data.status} />}
            />
            <InfoRow
              label="Tanggal Upload"
              value={new Date(data.uploadedAt).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
              })}
            />

            <div
              style={{
                marginTop: 2,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                }}
              >
                Status Terakhir
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: "#0f172a" }}>
                {lastActionLabel}
                {data.status !== "pending" ? ` oleh ${lastActionBy}` : ""}
              </div>
              <div style={{ marginTop: 2, fontSize: 12, color: "#64748b" }}>
                {data.status !== "pending"
                  ? `Pada ${lastActionAt}`
                  : "Belum ada tindakan verifikasi"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ color: "#64748b", fontSize: 13 }}>Preview File</div>
            <FilePreview
              key={`${data.filePath}|${data.fileName}`}
              filePath={data.filePath}
              fileName={data.fileName}
              previewKind={previewKind}
            />
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <a
            href={data.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Buka File
          </a>

          <a
            href={data.filePath}
            download={data.fileName}
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Download File
          </a>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            {canManage && onReject && data.status !== "rejected" && (
              <button
                onClick={async () => {
                  try {
                    await onReject(data);
                  } catch (e) {
                    console.error(e);
                  }
                  onClose();
                }}
                style={{
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                {data.status === "verified" ? "Tolak Ulang" : "Tolak"}
              </button>
            )}

            {canManage && onVerify && data.status !== "verified" && (
              <button
                onClick={async () => {
                  try {
                    await onVerify(data);
                  } catch (e) {
                    console.error(e);
                  }
                  onClose();
                }}
                style={{
                  border: "1px solid #bae6fd",
                  background: "#ecfeff",
                  color: "#0e7490",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                {data.status === "rejected" ? "Verifikasi Ulang" : "Verifikasi"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
