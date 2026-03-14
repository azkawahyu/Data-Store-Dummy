import { DocumentStatus } from "./types";

const STATUS_STYLE: Record<
  DocumentStatus,
  { bg: string; color: string; label: string }
> = {
  pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
  verified: { bg: "#dcfce7", color: "#166534", label: "Verified" },
  rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
};

const FALLBACK_STYLE = { bg: "#e5e7eb", color: "#374151", label: "Unknown" };

export default function DocumentStatusBadge({
  status,
}: {
  status?: DocumentStatus | string;
}) {
  const s = STATUS_STYLE[status as DocumentStatus] ?? {
    ...FALLBACK_STYLE,
    label:
      typeof status === "string" && status.length > 0
        ? status[0].toUpperCase() + status.slice(1)
        : FALLBACK_STYLE.label,
  };

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}
