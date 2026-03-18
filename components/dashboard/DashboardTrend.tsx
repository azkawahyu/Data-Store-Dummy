"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Document {
  uploaded_at?: string | null;
}

interface Props {
  documents: Document[];
}

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
}

export default function DashboardTrend({ documents }: Props) {
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }

  const counts = Object.fromEntries(months.map((m) => [m, 0]));
  for (const doc of documents) {
    if (!doc.uploaded_at) continue;
    const key = getMonthKey(doc.uploaded_at);
    if (key in counts) counts[key]++;
  }

  const data = months.map((m) => ({
    bulan: getMonthLabel(m),
    dokumen: counts[m],
  }));

  return (
    <section
      className="dash-trend-card"
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,.92)",
        boxShadow: "0 8px 22px rgba(15,23,42,.05)",
      }}
    >
      <style>{`
        .dash-trend-chart {
          width: 100%;
          height: 200px;
        }

        @media (max-width: 640px) {
          .dash-trend-card {
            padding: 12px;
          }

          .dash-trend-chart {
            height: 170px;
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
        Tren Upload Dokumen
      </h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
        6 bulan terakhir
      </p>
      <div className="dash-trend-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={20}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              allowDecimals={false}
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
            <Bar dataKey="dokumen" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
