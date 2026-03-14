interface Props {
  employeeCount: number;
  documentCount: number;
}

export default function DashboardStats({
  employeeCount,
  documentCount,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h3>Total Pegawai</h3>
        <p style={{ textAlign: "right" }}>{employeeCount}</p>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h3>Total Dokumen</h3>
        <p style={{ textAlign: "right" }}>{documentCount}</p>
      </div>
    </div>
  );
}
