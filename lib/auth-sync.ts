export const AUTH_SYNC_KEY = "auth:event";

export type AuthSyncEventType = "login" | "logout";

export function broadcastAuthEvent(type: AuthSyncEventType) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    AUTH_SYNC_KEY,
    JSON.stringify({
      type,
      at: Date.now(),
    }),
  );
}
