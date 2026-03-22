"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  formatDocumentStatusLabel,
  normalizeDocumentStatus,
} from "@/components/documents/status";

type Employee = {
  id: string;
  unit: string | null;
};

type Document = {
  id: string;
  document_type: string;
  status: string;
};

interface ChartItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  data: ChartItem[];
}

interface Props {
  employees: Employee[];
  documents: Document[];
}

interface TooltipPayloadItem {
  name?: string | number;
  value?: number | string;
}

const CHART_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#22C55E",
  "#F59E0B",
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#6366F1",
];

const STATUS_COLORS: Record<string, string> = {
  verified: "#22C55E",
  pending: "#F59E0B",
  rejected: "#EF4444",
};

function formatStatusLabel(status: string) {
  return formatDocumentStatusLabel(status);
}

function toChartData(
  input: Record<string, number>,
  colorResolver?: (label: string, index: number) => string,
): ChartItem[] {
  const entries = Object.entries(input).filter(([, value]) => value > 0);

  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], index) => ({
      label,
      value,
      color:
        colorResolver?.(label, index) ??
        CHART_COLORS[index % CHART_COLORS.length],
    }));
}

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadItem>;
  total: number;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const value = Number(item.value || 0);
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "8px 10px",
        boxShadow: "0 8px 24px rgba(15,23,42,.08)",
      }}
    >
      <div style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>
        {item.name}
      </div>
      <div style={{ fontSize: 13, color: "#0f172a" }}>
        {value} item ({percentage}%)
      </div>
    </div>
  );
}

function PieChartCard({ title, data }: PieChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,.92)",
        boxShadow: "0 8px 22px rgba(15,23,42,.05)",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px",
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>

      {data.length > 0 ? (
        <>
          <div
            style={{ position: "relative", maxWidth: 220, margin: "0 auto" }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {data.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => (
                    <CustomTooltip
                      active={active}
                      payload={payload?.map((entry) => ({
                        name: entry?.name,
                        value:
                          typeof entry?.value === "number" ||
                          typeof entry?.value === "string"
                            ? entry.value
                            : 0,
                      }))}
                      total={total}
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b" }}>Total</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
                {total}
              </div>
            </div>
          </div>

          <div className="stats-pie-legend">
            {data.map((item) => (
              <div key={item.label} className="stats-pie-legend-row">
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: item.color,
                  }}
                />
                <span
                  title={item.label}
                  style={{
                    color: "#334155",
                    fontSize: 13,
                    minWidth: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    flexShrink: 0,
                    color: "#0f172a",
                    fontSize: 12,
                    fontWeight: 600,
                    paddingLeft: 4,
                  }}
                >
                  {item.value} ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
          Belum ada data untuk ditampilkan.
        </p>
      )}
    </section>
  );
}

export default function StatisticsPieCharts({ employees, documents }: Props) {
  const employeeByUnit = toChartData(
    employees.reduce<Record<string, number>>((acc, employee) => {
      const unit = employee.unit?.trim() || "Tanpa Unit";
      acc[unit] = (acc[unit] || 0) + 1;
      return acc;
    }, {}),
  );

  const documentByType = toChartData(
    documents.reduce<Record<string, number>>((acc, document) => {
      const docType = document.document_type?.trim() || "Tidak Diketahui";
      acc[docType] = (acc[docType] || 0) + 1;
      return acc;
    }, {}),
  );

  const documentByStatus = toChartData(
    documents.reduce<Record<string, number>>((acc, document) => {
      const status = formatStatusLabel(
        normalizeDocumentStatus(document.status),
      );
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}),
    (label, index) =>
      STATUS_COLORS[label.trim().toLowerCase()] ??
      CHART_COLORS[index % CHART_COLORS.length],
  );

  return (
    <>
      <style>{`
        .stats-pie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .stats-pie-legend {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
        }

        .stats-pie-legend-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          min-width: 0;
        }

        @media (max-width: 640px) {
          .stats-pie-grid {
            grid-template-columns: 1fr;
          }

          .stats-pie-legend {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="stats-pie-grid">
        <PieChartCard title="Karyawan Berdasarkan Unit" data={employeeByUnit} />
        <PieChartCard title="Dokumen Berdasarkan Tipe" data={documentByType} />
        <PieChartCard
          title="Dokumen Berdasarkan Status"
          data={documentByStatus}
        />
      </div>
    </>
  );
}
