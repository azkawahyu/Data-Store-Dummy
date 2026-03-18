"use client";

import DocumentStatusBadge from "./DocumentStatusBadge";
import { DocumentItem } from "./types";

interface Props {
  rows: DocumentItem[];
  canManage: boolean;
  onView: (doc: DocumentItem) => void;
  onVerify: (doc: DocumentItem) => void;
  onReject: (doc: DocumentItem) => void;
  onEdit?: (doc: DocumentItem) => void;
  onDelete?: (doc: DocumentItem) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export default function DocumentsTable({
  rows,
  canManage,
  onView,
  onVerify,
  onReject,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: Props) {
  const selected = new Set(selectedIds ?? []);

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        overflow: "hidden",
        background: "white",
      }}
    >
      <style>{`
        .doc-action-btn {
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          color: #64748b;
          transition: background .15s, color .15s;
        }
        .doc-action-btn:hover { background: #f1f5f9; color: #0f172a; }
        .doc-action-btn.delete:hover { background: #fee2e2; color: #dc2626; }

        @media (max-width: 768px) {
          .docs-desktop { display: none; }
          .docs-mobile { display: block; }
        }
        @media (min-width: 769px) {
          .docs-desktop { display: block; }
          .docs-mobile { display: none; }
        }
      `}</style>

      {/* Desktop */}
      <div className="docs-desktop">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1.2fr 0.8fr 1fr 0.9fr 0.9fr 1.2fr",
            gap: 8,
            padding: "10px 12px",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={rows.length > 0 && rows.every((r) => selected.has(r.id))}
              onChange={(e) => {
                if (!onSelectionChange) return;
                if (e.target.checked) onSelectionChange(rows.map((r) => r.id));
                else onSelectionChange([]);
              }}
            />
          </div>
          <div>Pegawai</div>
          <div>Jenis Dokumen</div>
          <div>File</div>
          <div>Diunggah</div>
          <div>Status</div>
          <div>Aksi</div>
        </div>

        {rows.map((d) => (
          <div
            key={d.id}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1.2fr 0.8fr 1fr 0.9fr 0.9fr 1.2fr",
              gap: 8,
              padding: "10px 12px",
              borderBottom: "1px solid #f1f5f9",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={selected.has(d.id)}
                onChange={(e) => {
                  if (!onSelectionChange) return;
                  const next = new Set(selected);
                  if (e.target.checked) next.add(d.id);
                  else next.delete(d.id);
                  onSelectionChange(Array.from(next));
                }}
              />
            </div>
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
            <div>
              {new Date(d.uploadedAt).toLocaleDateString("id-ID", {
                timeZone: "Asia/Jakarta",
              })}
            </div>
            <div>
              <DocumentStatusBadge status={d.status} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => onView(d)} className="doc-action-btn">
                👁️ View
              </button>

              {/* {canManage && onEdit && (
                <button onClick={() => onEdit(d)} className="doc-action-btn">
                  ✏️ Edit
                </button>
              )} */}

              {canManage && onDelete && (
                <button
                  onClick={() => onDelete(d)}
                  className="doc-action-btn delete"
                >
                  🗑️ Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="docs-mobile">
        {onSelectionChange && rows.length > 0 && (
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={
                  rows.length > 0 && rows.every((r) => selected.has(r.id))
                }
                onChange={(e) => {
                  if (e.target.checked)
                    onSelectionChange(rows.map((r) => r.id));
                  else onSelectionChange([]);
                }}
              />
              Pilih semua
            </label>
          </div>
        )}

        {rows.map((d) => (
          <div
            key={d.id}
            style={{
              padding: 12,
              borderBottom: "1px solid #f1f5f9",
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>{d.employeeName}</div>
              <input
                type="checkbox"
                checked={selected.has(d.id)}
                onChange={(e) => {
                  if (!onSelectionChange) return;
                  const next = new Set(selected);
                  if (e.target.checked) next.add(d.id);
                  else next.delete(d.id);
                  onSelectionChange(Array.from(next));
                }}
              />
            </div>

            <div style={{ fontSize: 13, color: "#475569" }}>
              Jenis Dokumen: {d.documentType}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#475569",
                wordBreak: "break-word",
              }}
            >
              File: {d.fileName}
            </div>
            <div style={{ fontSize: 13, color: "#475569" }}>
              Diunggah:{" "}
              {new Date(d.uploadedAt).toLocaleDateString("id-ID", {
                timeZone: "Asia/Jakarta",
              })}
            </div>
            <div>
              <DocumentStatusBadge status={d.status} />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => onView(d)} className="doc-action-btn">
                👁️ View
              </button>

              {canManage && onEdit && (
                <button onClick={() => onEdit(d)} className="doc-action-btn">
                  ✏️ Edit
                </button>
              )}

              {canManage && onDelete && (
                <button
                  onClick={() => onDelete(d)}
                  className="doc-action-btn delete"
                >
                  🗑️ Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div style={{ padding: 14, color: "#64748b" }}>
          Belum ada data dokumen.
        </div>
      )}
    </div>
  );
}
