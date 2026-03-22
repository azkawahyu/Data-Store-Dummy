export const ROLE_LABELS = {
  admin: "Admin",
  employee: "Pegawai",
  hr: "Admin Umum",
} as const;

export type RoleKey = keyof typeof ROLE_LABELS;

export function getRoleLabel(role?: string | null) {
  const normalized = (role ?? "").trim().toLowerCase() as RoleKey;
  return ROLE_LABELS[normalized] ?? "-";
}

export function getSignedInRoleLabel(role?: string | null) {
  const normalized = (role ?? "").trim().toLowerCase() as RoleKey;
  return ROLE_LABELS[normalized] ?? "User";
}

export function getEmployeeConnectionLabel(hasEmployeeId: boolean) {
  return hasEmployeeId ? "✓ Terhubung" : "⚠ Belum terhubung";
}

export function getEmployeeConnectionShortLabel(hasEmployeeId: boolean) {
  return hasEmployeeId ? "Terhubung" : "Belum terhubung";
}

export function getEmployeeConnectionNoticeTitle(hasEmployeeId: boolean) {
  return hasEmployeeId
    ? "Data pegawai sudah terhubung"
    : "Data pegawai belum terhubung";
}

export function getEmployeeConnectionTone(hasEmployeeId: boolean) {
  return hasEmployeeId
    ? { bg: "rgba(220,252,231,.9)", color: "#15803d", border: "#86efac" }
    : { bg: "rgba(254,243,199,.9)", color: "#92400e", border: "#fcd34d" };
}
