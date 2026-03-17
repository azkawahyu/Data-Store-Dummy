const UNIT_STATS = [
  { key: "total", label: "Total Pegawai", color: "#0f172a" },
  { key: "Teknik", label: "Teknik", color: "#1d4ed8" },
  { key: "Umum", label: "Umum", color: "#0369a1" },
  { key: "Program", label: "Program", color: "#7c3aed" },
  { key: "Berita", label: "Berita", color: "#be185d" },
  { key: "Keuangan", label: "Keuangan", color: "#b45309" },
  { key: "KMB", label: "KMB", color: "#0f766e" },
  { key: "Tata Usaha", label: "Tata Usaha", color: "#15803d" },
  { key: "Kepala Stasiun", label: "Kepala Stasiun", color: "#9f1239" },
] as const;

interface Props {
  employees: { unit: string }[];
}

export default function EmployeeStats({ employees }: Props) {
  const stats: Record<string, number> = { total: employees.length };
  UNIT_STATS.slice(1).forEach(({ key }) => {
    stats[key] = employees.filter((e) => e.unit === key).length;
  });

  return (
    <>
      <style>{`
        .emp-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        .emp-stat-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          background: white;
          box-shadow: 0 2px 8px rgba(15,23,42,.05);
          min-width: 0;
        }
        .emp-stat-card.total {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-color: transparent;
        }
        .emp-stat-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #64748b;
        }
        .emp-stat-card.total .emp-stat-label { color: #94a3b8; }
        .emp-stat-value {
          margin-top: 6px;
          font-size: 26px;
          font-weight: 700;
        }
        .emp-stat-card.total .emp-stat-value { color: white; }

        @media (max-width: 640px) {
          .emp-stats { grid-template-columns: repeat(3, 1fr); }
          .emp-stat-value { font-size: 20px; }
        }
      `}</style>

      <div className="emp-stats">
        {UNIT_STATS.map(({ key, label, color }) => (
          <div
            key={key}
            className={`emp-stat-card${key === "total" ? " total" : ""}`}
          >
            <div className="emp-stat-label">{label}</div>
            <div
              className="emp-stat-value"
              style={key !== "total" ? { color } : undefined}
            >
              {stats[key] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
