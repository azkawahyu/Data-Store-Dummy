"use client";

interface Props {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

const DOC_STATS = [
  {
    key: "total",
    label: "Total Dokumen",
    bg: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)",
    textColor: "#fff",
    labelColor: "#e0e7ff",
  },
  {
    key: "pending",
    label: "Pending",
    bg: "linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)",
    textColor: "#92400e",
    labelColor: "#b45309",
  },
  {
    key: "verified",
    label: "Disetujui",
    bg: "linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)",
    textColor: "#166534",
    labelColor: "#15803d",
  },
  {
    key: "rejected",
    label: "Ditolak",
    bg: "linear-gradient(135deg,#fee2e2 0%,#fecaca 100%)",
    textColor: "#991b1b",
    labelColor: "#b91c1c",
  },
] as const;

export default function DocumentsStats({
  total,
  pending,
  verified,
  rejected,
}: Props) {
  const stats: Record<string, number> = { total, pending, verified, rejected };

  return (
    <>
      <style>{`
        .doc-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
        }
        .doc-stat-card {
          border-radius: 14px;
          padding: 14px 16px;
          min-width: 0;
          box-shadow: 0 2px 8px rgba(15,23,42,.07);
          transition: transform .15s, box-shadow .15s;
        }
        .doc-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(15,23,42,.12);
        }
        .doc-stat-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-stat-value {
          margin-top: 8px;
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
        }

        @media (max-width: 640px) {
          .doc-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .doc-stat-card { padding: 10px 12px; }
          .doc-stat-value { font-size: 22px; }
        }
      `}</style>

      <div className="doc-stats">
        {DOC_STATS.map(({ key, label, bg, textColor, labelColor }) => (
          <div
            key={key}
            className="doc-stat-card"
            style={{ background: bg, border: "1px solid transparent" }}
          >
            <div className="doc-stat-label" style={{ color: labelColor }}>
              {label}
            </div>
            <div className="doc-stat-value" style={{ color: textColor }}>
              {stats[key] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
