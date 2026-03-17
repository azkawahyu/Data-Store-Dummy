type ActivityPayload = {
  action: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
};

export function buildActivityDescription(
  action: string,
  metadata?: Record<string, unknown>,
): string {
  // Simpan JSON konsisten agar frontend bisa parse stabil
  return JSON.stringify({
    action,
    ...metadata,
  });
}

export async function logActivity(payload: ActivityPayload) {
  const description = buildActivityDescription(payload.action, payload.metadata);

  // ...existing code...
  // insert ke DB:
  // { user_id: payload.userId, action: payload.action, description }
  // ...existing code...
}