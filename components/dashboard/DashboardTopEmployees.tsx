"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Document {
  employee_name?: string | null;
}

interface Props {
  documents: Document[];
}

const BAR_COLORS = ["#6366F1", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B"];

export default function DashboardTopEmployees({ documents }: Props) {
  const countMap: Record<string, number> = {};
  for (const doc of documents) {
    const name = doc.employee_name?.trim() || "Tidak Diketahui";
    countMap[name] = (countMap[name] || 0) + 1;
  }

  const data = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nama, jumlah]) => ({ nama, jumlah }));

  return (
    <section
      className="dash-top-card"
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        background: "white",
      }}
    >
      <style>{`
        .dash-top-chart {
          width: 100%;
          height: 200px;
        }

        @media (max-width: 640px) {
          .dash-top-card {
            padding: 12px;
          }

          .dash-top-chart {
            height: 180px;
          }
        }
      `}</style>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 15,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        Top 5 Karyawan
      </h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
        Berdasarkan jumlah dokumen
      </p>

      {data.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          Belum ada data.
        </p>
      ) : (
        <div className="dash-top-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barSize={16}
              margin={{ top: 0, right: 8, left: -6, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#64748b" }}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nama"
                width={84}
                tick={{ fontSize: 11, fill: "#334155" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
                formatter={(value) => [Number(value), "Dokumen"]}
              />
              <Bar dataKey="jumlah" radius={[0, 4, 4, 0]}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
