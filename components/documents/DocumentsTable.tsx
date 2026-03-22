"use client";

import DocumentStatusBadge from "./DocumentStatusBadge";
import { DocumentItem } from "./types";

interface Props {
  rows: DocumentItem[];
  canManage: boolean;
  canDelete: boolean;
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
  canDelete,
  onView,
  onVerify,
  onReject,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: Props) {
  void onVerify;
  void onReject;

  const selected = new Set(selectedIds ?? []);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  return (
    <>
      <style>{`
        .doc-table-wrap {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          overflow-x: auto;
          box-shadow: 0 2px 10px rgba(99,102,241,.06);
        }

        .doc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
          min-width: 820px;
        }

        .doc-table thead {
          background: linear-gradient(90deg,#eef2ff 0%,#e0e7ff 100%);
          border-bottom: 2px solid #c7d2fe;
        }

        .doc-table th {
          padding: 11px 14px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          color: #4338ca;
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
        }

        .doc-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }

        .doc-table tbody tr:last-child td { border-bottom: none; }
        .doc-table tbody tr:hover { background: #f5f7ff; }

        .doc-employee-cell {
          font-weight: 600;
          color: #312e81;
        }

        .doc-type-chip {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: #e0f2fe;
          color: #0369a1;
        }

        .doc-file-cell {
          color: #6366f1;
          font-size: 12.5px;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-date-cell {
          color: #64748b;
          font-size: 12.5px;
          white-space: nowrap;
        }

        .doc-action-btn {
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          transition: background .15s, transform .1s;
        }
        .doc-action-btn.view {
          background: #ede9fe;
          color: #7c3aed;
        }
        .doc-action-btn.view:hover {
          background: #ddd6fe;
          transform: scale(1.04);
        }
        .doc-action-btn.edit {
          background: #ecfeff;
          color: #0e7490;
        }
        .doc-action-btn.edit:hover {
          background: #cffafe;
          transform: scale(1.04);
        }
        .doc-action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
        .doc-action-btn.delete:hover {
          background: #fecaca;
          transform: scale(1.04);
        }

        .doc-card-list { display: none; }

        @media (max-width: 640px) {
          .doc-table-wrap { display: none; }
          .doc-card-list {
            display: grid;
            gap: 10px;
          }
          .doc-card {
            border-radius: 14px;
            padding: 14px 16px;
            background: #fff;
            display: grid;
            gap: 6px;
            box-shadow: 0 2px 10px rgba(99,102,241,.08);
            border: 1px solid #e0e7ff;
          }
          .doc-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
          }
          .doc-card-name {
            font-size: 15px;
            font-weight: 700;
            color: #312e81;
          }
          .doc-card-meta { font-size: 12.5px; color: #475569; }
          .doc-card-file { font-size: 12px; color: #6366f1; word-break: break-all; }
          .doc-card-date { font-size: 12px; color: #64748b; }
          .doc-card-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 4px;
          }
        }
      `}</style>

      {/* Desktop table */}
      <div className="doc-table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th style={{ width: 42 }}>
                {onSelectionChange ? (
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      if (!onSelectionChange) return;
                      if (e.target.checked)
                        onSelectionChange(rows.map((r) => r.id));
                      else onSelectionChange([]);
                    }}
                  />
                ) : null}
              </th>
              <th>Pegawai</th>
              <th>Jenis Dokumen</th>
              <th>File</th>
              <th>Diunggah</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", color: "#94a3b8", padding: 36 }}
                >
                  Belum ada data dokumen.
                </td>
              </tr>
            ) : (
              rows.map((d) => (
                <tr key={d.id}>
                  <td>
                    {onSelectionChange ? (
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
                    ) : null}
                  </td>

                  <td className="doc-employee-cell">{d.employeeName}</td>

                  <td>
                    <span className="doc-type-chip">{d.documentType}</span>
                  </td>

                  <td title={d.fileName} className="doc-file-cell">
                    {d.fileName}
                  </td>

                  <td className="doc-date-cell">
                    {new Date(d.uploadedAt).toLocaleDateString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}
                  </td>

                  <td>
                    <DocumentStatusBadge status={d.status} />
                  </td>

                  <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                    <button
                      onClick={() => onView(d)}
                      className="doc-action-btn view"
                    >
                      👁️ View
                    </button>{" "}
                    {/* {canManage && onEdit && (
                      <button
                        onClick={() => onEdit(d)}
                        className="doc-action-btn edit"
                      >
                        ✏️ Edit
                      </button>
                    )}{" "} */}
                    {canDelete && onDelete && (
                      <button
                        onClick={() => onDelete(d)}
                        className="doc-action-btn delete"
                      >
                        🗑️ Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="doc-card-list">
        {rows.length === 0 ? (
          <p
            style={{ color: "#94a3b8", textAlign: "center", padding: "16px 0" }}
          >
            Belum ada data dokumen.
          </p>
        ) : (
          rows.map((d) => (
            <div key={d.id} className="doc-card">
              <div className="doc-card-header">
                <div className="doc-card-name">{d.employeeName}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <DocumentStatusBadge status={d.status} />
                  {onSelectionChange ? (
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
                  ) : null}
                </div>
              </div>

              <div className="doc-card-meta">
                Jenis Dokumen:{" "}
                <span className="doc-type-chip">{d.documentType}</span>
              </div>
              <div className="doc-card-file">File: {d.fileName}</div>
              <div className="doc-card-date">
                Diunggah:{" "}
                {new Date(d.uploadedAt).toLocaleDateString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}
              </div>

              <div className="doc-card-footer">
                <button
                  onClick={() => onView(d)}
                  className="doc-action-btn view"
                >
                  👁️ View
                </button>
                {/* {canManage && onEdit && (
                  <button
                    onClick={() => onEdit(d)}
                    className="doc-action-btn edit"
                  >
                    ✏️ Edit
                  </button>
                )} */}
                {canDelete && onDelete && (
                  <button
                    onClick={() => onDelete(d)}
                    className="doc-action-btn delete"
                  >
                    🗑️ Hapus
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
