const UNIT_STATS = [
  {
    key: "total",
    label: "Total Pegawai",
    bg: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)",
    textColor: "#fff",
    labelColor: "#e0e7ff",
  },
  {
    key: "Teknik",
    label: "Teknik",
    bg: "linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)",
    textColor: "#1d4ed8",
    labelColor: "#3b82f6",
    border: "#bfdbfe",
  },
  {
    key: "Umum",
    label: "Umum",
    bg: "linear-gradient(135deg,#e0f2fe 0%,#bae6fd 100%)",
    textColor: "#0369a1",
    labelColor: "#0284c7",
    border: "#bae6fd",
  },
  {
    key: "Program",
    label: "Program",
    bg: "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%)",
    textColor: "#7c3aed",
    labelColor: "#8b5cf6",
    border: "#ddd6fe",
  },
  {
    key: "Berita",
    label: "Berita",
    bg: "linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%)",
    textColor: "#be185d",
    labelColor: "#db2777",
    border: "#fbcfe8",
  },
  {
    key: "Keuangan",
    label: "Keuangan",
    bg: "linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)",
    textColor: "#b45309",
    labelColor: "#d97706",
    border: "#fde68a",
  },
  {
    key: "KMB",
    label: "KMB",
    bg: "linear-gradient(135deg,#ccfbf1 0%,#99f6e4 100%)",
    textColor: "#0f766e",
    labelColor: "#0d9488",
    border: "#99f6e4",
  },
  {
    key: "Tata Usaha",
    label: "Tata Usaha",
    bg: "linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)",
    textColor: "#15803d",
    labelColor: "#16a34a",
    border: "#bbf7d0",
  },
  {
    key: "Kepala Stasiun",
    label: "Kepala Stasiun",
    bg: "linear-gradient(135deg,#ffe4e6 0%,#fecdd3 100%)",
    textColor: "#9f1239",
    labelColor: "#be123c",
    border: "#fecdd3",
  },
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
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
        }
        .emp-stat-card {
          border-radius: 14px;
          padding: 14px 16px;
          min-width: 0;
          box-shadow: 0 2px 8px rgba(15,23,42,.07);
          transition: transform .15s, box-shadow .15s;
        }
        .emp-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(15,23,42,.12);
        }
        .emp-stat-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .emp-stat-value {
          margin-top: 8px;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
        }
        @media (max-width: 640px) {
          .emp-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .emp-stat-value { font-size: 22px; }
          .emp-stat-card { padding: 10px 12px; }
        }
      `}</style>

      <div className="emp-stats">
        {UNIT_STATS.map(({ key, label, bg, textColor, labelColor }) => (
          <div
            key={key}
            className="emp-stat-card"
            style={{ background: bg, border: `1px solid transparent` }}
          >
            <div
              className="emp-stat-label"
              style={{ color: labelColor ?? textColor }}
            >
              {label}
            </div>
            <div className="emp-stat-value" style={{ color: textColor }}>
              {stats[key] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
