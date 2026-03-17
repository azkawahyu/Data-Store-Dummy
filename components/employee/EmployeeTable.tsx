import type { Employee } from "@/types/employee";

interface Props {
  employees: Employee[];
  canManage: boolean;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export default function EmployeeTable({
  employees,
  canManage,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <style>{`
        .emp-table-wrap {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(15,23,42,.05);
        }
        .emp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 640px;
        }
        .emp-table thead {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .emp-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: .05em;
          white-space: nowrap;
        }
        .emp-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .emp-table tbody tr:last-child td { border-bottom: none; }
        .emp-table tbody tr:hover { background: #f8fafc; }

        .emp-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .emp-badge-tetap   { background: #dcfce7; color: #166534; }
        .emp-badge-kontrak { background: #fef9c3; color: #854d0e; }

        .emp-action-btn {
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 13px;
          color: #64748b;
          transition: background .15s, color .15s;
        }
        .emp-action-btn:hover        { background: #f1f5f9; color: #0f172a; }
        .emp-action-btn.delete:hover { background: #fee2e2; color: #dc2626; }

        /* ── Mobile cards ── */
        .emp-card-list { display: none; }

        @media (max-width: 640px) {
          .emp-table-wrap { display: none; }
          .emp-card-list  { display: grid; gap: 10px; }

          .emp-card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px 16px;
            background: white;
            display: grid;
            gap: 4px;
            box-shadow: 0 2px 8px rgba(15,23,42,.05);
          }
          .emp-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
          }
          .emp-card-name  { font-size: 15px; font-weight: 600; color: #0f172a; }
          .emp-card-nip   { font-size: 12px; color: #94a3b8; }
          .emp-card-meta  { font-size: 13px; color: #475569; }
          .emp-card-email { font-size: 12px; color: #64748b; word-break: break-all; }
          .emp-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 6px;
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
              {canManage && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={canManage ? 9 : 8}
                  style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr key={emp.id}>
                  <td style={{ color: "#94a3b8", width: 36 }}>{i + 1}</td>
                  <td
                    style={{
                      color: "#64748b",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {emp.nip}
                  </td>
                  <td style={{ fontWeight: 500 }}>{emp.nama}</td>
                  <td>{emp.jabatan}</td>
                  <td>{emp.unit}</td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>
                    {emp.email}
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>
                    {emp.no_hp}
                  </td>
                  {canManage && (
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        className="emp-action-btn"
                        onClick={() => onEdit(emp)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="emp-action-btn delete"
                        onClick={() => onDelete(emp)}
                      >
                        🗑️ Hapus
                      </button>
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
          <p style={{ color: "#94a3b8" }}>Data tidak ditemukan.</p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="emp-card">
              <div className="emp-card-header">
                <div>
                  <div className="emp-card-name">{emp.nama}</div>
                  <div className="emp-card-nip">{emp.nip}</div>
                </div>
              </div>
              <div className="emp-card-meta">
                {emp.jabatan} — {emp.unit}
              </div>
              <div className="emp-card-email">{emp.email}</div>
              <div className="emp-card-meta">{emp.no_hp}</div>
              {canManage && (
                <div className="emp-card-footer">
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="emp-action-btn"
                      onClick={() => onEdit(emp)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="emp-action-btn delete"
                      onClick={() => onDelete(emp)}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
