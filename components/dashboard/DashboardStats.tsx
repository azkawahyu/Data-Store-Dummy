interface Props {
  employeeCount: number;
  documentCount: number;
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        background: "white",
        boxShadow: "0 6px 16px rgba(15,23,42,.06)",
        minWidth: 0,
      }}
    >
      <div style={{ color: "#64748b", fontSize: 12 }}>{title}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 700,
          color: "#0f172a",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DashboardStats({
  employeeCount,
  documentCount,
}: Props) {
  return (
    <>
      <style>{`
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }
      `}</style>

      <div className="dashboard-stats-grid">
        <Card title="Total Pegawai" value={employeeCount} />
        <Card title="Total Dokumen" value={documentCount} />
      </div>
    </>
  );
}
