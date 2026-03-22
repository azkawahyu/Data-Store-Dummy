import { DocumentStatus } from "./types";
import { formatDocumentStatusLabel, getDocumentStatusTone } from "./status";

export default function DocumentStatusBadge({
  status,
}: {
  status?: DocumentStatus | string;
}) {
  const s = getDocumentStatusTone(status);
  const label = formatDocumentStatusLabel(status);

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
      {label}
    </span>
  );
}
