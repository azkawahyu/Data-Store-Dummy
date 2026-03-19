"use client";

import Link from "next/link";

interface PendingDocument {
  id: string;
  file_name?: string;
  document_type?: string;
  employee_name?: string | null;
  uploaded_at?: string | null;
}

interface Props {
  documents: PendingDocument[];
  showViewAll?: boolean;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPendingTable({
  documents,
  showViewAll = true,
}: Props) {
  const pending = documents.filter((d) => d.file_name).slice(0, 6);

  return (
    <section
      className="dash-pending-card"
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,.92)",
        boxShadow: "0 8px 22px rgba(15,23,42,.05)",
      }}
    >
      <style>{`
        .dash-pending-desktop {
          display: block;
        }

        .dash-pending-mobile {
          display: none;
        }

        @media (max-width: 640px) {
          .dash-pending-card {
            padding: 12px;
          }

          .dash-pending-desktop {
            display: none;
          }

          .dash-pending-mobile {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 4px",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Dokumen Menunggu Verifikasi
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            {documents.length} dokumen perlu ditindaklanjuti
          </p>
        </div>
        {showViewAll && (
          <Link
            href="/documents"
            style={{
              fontSize: 13,
              color: "#4f46e5",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Lihat semua →
          </Link>
        )}
      </div>

      {pending.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          Tidak ada dokumen pending.
        </p>
      ) : (
        <>
          <div className="dash-pending-desktop" style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #dbeafe",
                    background: "#f8fbff",
                  }}
                >
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Nama File
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tipe
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Karyawan
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      color: "#64748b",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Diunggah
                  </th>
                </tr>
              </thead>
              <tbody>
                {pending.map((doc) => (
                  <tr
                    key={doc.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td
                      style={{
                        padding: "9px 10px",
                        color: "#0f172a",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={doc.file_name}
                    >
                      {doc.file_name ?? "-"}
                    </td>
                    <td
                      style={{
                        padding: "9px 10px",
                        color: "#334155",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {doc.document_type ?? "-"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "9px 10px",
                        color: "#334155",
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doc.employee_name ?? "-"}
                    </td>
                    <td
                      style={{
                        padding: "9px 10px",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(doc.uploaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-pending-mobile">
            {pending.map((doc) => (
              <article
                key={doc.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 10,
                  background: "#f8fbff",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                    wordBreak: "break-word",
                  }}
                >
                  {doc.file_name ?? "-"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Karyawan: {doc.employee_name ?? "-"}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#3b82f6",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {doc.document_type ?? "-"}
                  </span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {formatDate(doc.uploaded_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
