import type { Employee } from "@/types/employee";

interface Props {
  employees: Employee[];
  canManage: boolean;
  canEditAll: boolean;
  editableEmployeeId: string | null;
  canDelete: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export default function EmployeeTable({
  employees,
  canManage,
  canEditAll,
  editableEmployeeId,
  canDelete,
  onEdit,
  onDelete,
}: Props) {
  const showActions = !canManage && (canEditAll || Boolean(editableEmployeeId));

  return (
    <>
      <style>{`
        /* ── Desktop table ── */
        .emp-table-wrap {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #fff;
          overflow-x: auto;
          box-shadow: 0 2px 10px rgba(99,102,241,.06);
        }
        .emp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
          min-width: 650px;
        }
        .emp-table thead {
          background: linear-gradient(90deg,#eef2ff 0%,#e0e7ff 100%);
          border-bottom: 2px solid #c7d2fe;
        }
        .emp-table th {
          padding: 11px 14px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          color: #4338ca;
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
        }
        .emp-table td {
          padding: 11px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .emp-table tbody tr:last-child td { border-bottom: none; }
        .emp-table tbody tr:hover { background: #f5f7ff; }

        .emp-nip-cell {
          color: #6366f1;
          font-family: monospace;
          font-size: 12px;
          background: #eef2ff;
          border-radius: 6px;
          padding: 2px 7px;
          display: inline-block;
        }

        .emp-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }
        .emp-badge-tetap   { background: #dcfce7; color: #166534; }
        .emp-badge-kontrak { background: #fef9c3; color: #854d0e; }

        .emp-action-btn {
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          transition: background .15s, transform .1s;
        }
        .emp-action-btn.edit {
          background: #ede9fe;
          color: #7c3aed;
        }
        .emp-action-btn.edit:hover {
          background: #ddd6fe;
          transform: scale(1.04);
        }
        .emp-action-btn.detail {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .emp-action-btn.detail:hover {
          background: #bfdbfe;
          transform: scale(1.04);
        }
        .emp-action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }
        .emp-action-btn.delete:hover {
          background: #fecaca;
          transform: scale(1.04);
        }

        /* ── Unit chips ── */
        .emp-unit-chip {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: #e0f2fe;
          color: #0369a1;
        }

        /* ── Mobile cards ── */
        .emp-card-list { display: none; }

        @media (max-width: 640px) {
          .emp-table-wrap { display: none; }
          .emp-card-list  {
            display: grid;
            gap: 10px;
          }

          .emp-card {
            border-radius: 14px;
            padding: 14px 16px;
            background: #fff;
            display: grid;
            gap: 6px;
            box-shadow: 0 2px 10px rgba(99,102,241,.08);
            border: 1px solid #e0e7ff;
          }
          .emp-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
          }
          .emp-card-name  {
            font-size: 15px;
            font-weight: 700;
            color: #312e81;
          }
          .emp-card-nip {
            font-size: 11px;
            background: #eef2ff;
            color: #6366f1;
            padding: 1px 7px;
            border-radius: 6px;
            display: inline-block;
            font-family: monospace;
            margin-top: 2px;
          }
          .emp-card-meta  { font-size: 12.5px; color: #475569; }
          .emp-card-email { font-size: 12px; color: #6366f1; word-break: break-all; }
          .emp-card-hp    { font-size: 12px; color: #64748b; }
          .emp-card-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            margin-top: 4px;
          }
        }
      `}</style>

      {/* Desktop table */}
      <div className="emp-table-wrap">
        <table className="emp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NIP</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Unit</th>
              <th>Email</th>
              <th>No. HP</th>
              <th>Detail</th>
              {showActions && <th style={{ textAlign: "right" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={showActions ? 9 : 8}
                  style={{ textAlign: "center", color: "#94a3b8", padding: 36 }}
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr
                  key={emp.id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td style={{ color: "#94a3b8", width: 36, fontWeight: 500 }}>
                    {i + 1}
                  </td>
                  <td>
                    <span className="emp-nip-cell">{emp.nip}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "#312e81" }}>
                    {emp.nama}
                  </td>
                  <td style={{ color: "#475569" }}>{emp.jabatan}</td>
                  <td>
                    <span className="emp-unit-chip">{emp.unit}</span>
                  </td>
                  <td style={{ color: "#6366f1", fontSize: 12.5 }}>
                    {emp.email}
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12.5 }}>
                    {emp.no_hp}
                  </td>
                  <td
                    style={{ whiteSpace: "nowrap" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="emp-action-btn detail"
                      onClick={() => {
                        window.location.href = `/employee/${emp.id}`;
                      }}
                    >
                      🔎 Detail
                    </button>
                  </td>
                  {showActions && (
                    <td
                      style={{ whiteSpace: "nowrap", textAlign: "right" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(canEditAll || emp.id === editableEmployeeId) && (
                        <button
                          className="emp-action-btn edit"
                          onClick={() => onEdit(emp)}
                        >
                          ✏️ Edit
                        </button>
                      )}{" "}
                      {canDelete && canEditAll && (
                        <button
                          className="emp-action-btn delete"
                          onClick={() => onDelete(emp)}
                        >
                          🗑️ Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="emp-card-list">
        {employees.length === 0 ? (
          <p
            style={{ color: "#94a3b8", textAlign: "center", padding: "16px 0" }}
          >
            Data tidak ditemukan.
          </p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="emp-card">
              <div className="emp-card-header">
                <div>
                  <div className="emp-card-name">{emp.nama}</div>
                  <span className="emp-card-nip">{emp.nip}</span>
                </div>
                <span className="emp-unit-chip" style={{ flexShrink: 0 }}>
                  {emp.unit}
                </span>
              </div>
              <div className="emp-card-meta">{emp.jabatan}</div>
              <div className="emp-card-email">{emp.email}</div>
              <div className="emp-card-hp">{emp.no_hp}</div>
              <div className="emp-card-footer">
                <button
                  className="emp-action-btn detail"
                  onClick={() => {
                    window.location.href = `/employee/${emp.id}`;
                  }}
                >
                  🔎 Detail
                </button>
                {(canEditAll || emp.id === editableEmployeeId) && (
                  <button
                    className="emp-action-btn edit"
                    onClick={() => onEdit(emp)}
                  >
                    ✏️ Edit
                  </button>
                )}
                {canDelete && canEditAll && (
                  <button
                    className="emp-action-btn delete"
                    onClick={() => onDelete(emp)}
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

interface Props {
  employees: Employee[];
  canManage: boolean;
  canEditAll: boolean;
  editableEmployeeId: string | null;
  canDelete: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}
