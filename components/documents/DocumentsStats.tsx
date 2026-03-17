interface Props {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: 14,
        background: "white",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
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
        .documents-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }
        @media (min-width: 1024px) {
          .documents-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="documents-stats-grid">
        <StatCard title="Total" value={total} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="Verified" value={verified} />
        <StatCard title="Rejected" value={rejected} />
      </div>
    </>
  );
}
