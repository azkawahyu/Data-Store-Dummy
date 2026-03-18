"use client";

interface Props {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

function StatCard({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: number;
  tone: "slate" | "amber" | "green" | "red";
  icon: string;
}) {
  return (
    <div className={`doc-stat-card ${tone}`}>
      <div className="doc-stat-top">
        <span className="doc-stat-title">{title}</span>
        <span className="doc-stat-icon" aria-hidden>
          {icon}
        </span>
      </div>
      <div className="doc-stat-value">{value}</div>
    </div>
  );
}

export default function DocumentsStats({
  total,
  pending,
  verified,
  rejected,
}: Props) {
  return (
    <>
      <style>{`
        .doc-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .doc-stat-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fff;
          min-height: 78px;
          box-shadow: 0 1px 4px rgba(15,23,42,.06);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .doc-stat-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(15,23,42,.10);
        }

        .doc-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .doc-stat-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .03em;
          text-transform: uppercase;
          color: #64748b;
          line-height: 1.2;
        }

        .doc-stat-icon {
          font-size: 14px;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #f8fafc;
        }

        .doc-stat-value {
          margin-top: 8px;
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          color: #0f172a;
        }

        .doc-stat-card.slate  { border-color: #cbd5e1; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); }
        .doc-stat-card.amber  { border-color: #fcd34d; background: linear-gradient(180deg, #fffdf5 0%, #fffbeb 100%); }
        .doc-stat-card.green  { border-color: #86efac; background: linear-gradient(180deg, #f7fff9 0%, #f0fdf4 100%); }
        .doc-stat-card.red    { border-color: #fca5a5; background: linear-gradient(180deg, #fff7f7 0%, #fef2f2 100%); }

        .doc-stat-card.amber .doc-stat-value { color: #92400e; }
        .doc-stat-card.green .doc-stat-value { color: #166534; }
        .doc-stat-card.red   .doc-stat-value { color: #991b1b; }

        @media (max-width: 480px) {
          .doc-stat-card { min-height: 72px; padding: 9px 10px; }
          .doc-stat-value { font-size: 20px; }
          .doc-stat-title { font-size: 10px; }
        }
      `}</style>

      <div className="doc-stats-grid">
        <StatCard title="Total" value={total} tone="slate" icon="📄" />
        <StatCard title="Pending" value={pending} tone="amber" icon="⏳" />
        <StatCard title="Disetujui" value={verified} tone="green" icon="✅" />
        <StatCard title="Ditolak" value={rejected} tone="red" icon="❌" />
      </div>
    </>
  );
}
