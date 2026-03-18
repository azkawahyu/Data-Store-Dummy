interface Props {
  employeeCount: number;
  documentCount: number;
}

function Card({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: number;
  tone: string;
  icon: string;
}) {
  return (
    <div
      className={tone}
      style={{
        borderRadius: 16,
        padding: 16,
        minWidth: 0,
        boxShadow: "0 8px 20px rgba(15,23,42,.06)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: "rgba(255,255,255,.66)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.4)",
        }}
        aria-hidden
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          opacity: 0.9,
          marginTop: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 800,
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
        <Card
          title="Total Pegawai"
          value={employeeCount}
          icon="👥"
          tone="border border-cyan-200 bg-linear-to-r from-cyan-50 via-sky-50 to-cyan-100 text-cyan-700"
        />
        <Card
          title="Total Dokumen"
          value={documentCount}
          icon="🗂️"
          tone="border border-indigo-200 bg-linear-to-r from-indigo-50 via-violet-50 to-indigo-100 text-indigo-700"
        />
      </div>
    </>
  );
}
