import type { DocumentStatus } from "./types";

export const DOCUMENT_STATUS = {
  VERIFIED: "verified",
  REJECTED: "rejected",
  PENDING: "pending",
} as const;

export const DOCUMENT_STATUS_SET = new Set<DocumentStatus>([
  DOCUMENT_STATUS.VERIFIED,
  DOCUMENT_STATUS.REJECTED,
  DOCUMENT_STATUS.PENDING,
]);

const VERIFIED_STATUS_ALIASES = new Set([
  "verified",
  "verifikasi",
  "terverifikasi",
  "approved",
  "approve",
  "accepted",
  "accept",
  "disetujui",
  "setuju",
]);

const REJECTED_STATUS_ALIASES = new Set([
  "rejected",
  "reject",
  "rejection",
  "ditolak",
  "tolak",
  "declined",
  "decline",
]);

const PENDING_STATUS_ALIASES = new Set([
  "pending",
  "menunggu verifikasi",
  "menunggu",
  "waiting",
  "waiting approval",
  "in review",
  "review",
]);

export function normalizeDocumentStatus(
  status?: string | null,
): DocumentStatus {
  const normalized = (status ?? "").trim().toLowerCase();

  if (VERIFIED_STATUS_ALIASES.has(normalized)) return DOCUMENT_STATUS.VERIFIED;
  if (REJECTED_STATUS_ALIASES.has(normalized)) return DOCUMENT_STATUS.REJECTED;
  if (PENDING_STATUS_ALIASES.has(normalized)) return DOCUMENT_STATUS.PENDING;

  if (
    normalized === DOCUMENT_STATUS.VERIFIED ||
    normalized === DOCUMENT_STATUS.REJECTED
  ) {
    return normalized;
  }

  return DOCUMENT_STATUS.PENDING;
}

export function isDocumentStatus(
  status?: string | null,
): status is DocumentStatus {
  return DOCUMENT_STATUS_SET.has(normalizeDocumentStatus(status));
}

export function formatDocumentStatusLabel(status?: string | null): string {
  const normalized = normalizeDocumentStatus(status);

  if (normalized === DOCUMENT_STATUS.VERIFIED) return "Terverifikasi";
  if (normalized === DOCUMENT_STATUS.REJECTED) return "Ditolak";
  return "Menunggu Verifikasi";
}

export function getDocumentStatusTone(status?: string | null) {
  const normalized = normalizeDocumentStatus(status);

  if (normalized === DOCUMENT_STATUS.VERIFIED) {
    return { bg: "#ecfdf5", color: "#059669" };
  }

  if (normalized === DOCUMENT_STATUS.REJECTED) {
    return { bg: "#fef2f2", color: "#dc2626" };
  }

  return { bg: "#fffbeb", color: "#d97706" };
}

export function getDocumentStatusActionLabel(status: DocumentStatus) {
  if (status === DOCUMENT_STATUS.VERIFIED) return "verifikasi";
  if (status === DOCUMENT_STATUS.REJECTED) return "penolakan";
  return "pemeriksaan";
}

export function getDocumentStatusEndpoint(status: DocumentStatus) {
  if (status === DOCUMENT_STATUS.VERIFIED) return "verify";
  if (status === DOCUMENT_STATUS.REJECTED) return "reject";
  return "verify";
}

export function getDocumentStatusSuccessVerb(status: DocumentStatus) {
  if (status === DOCUMENT_STATUS.VERIFIED) return "diverifikasi";
  if (status === DOCUMENT_STATUS.REJECTED) return "ditolak";
  return "diproses";
}

export function getDocumentStatusActorLabel(status: DocumentStatus) {
  if (status === DOCUMENT_STATUS.VERIFIED) return "Anda";
  if (status === DOCUMENT_STATUS.REJECTED) return "Anda";
  return "Anda";
}
