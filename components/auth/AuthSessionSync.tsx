"use client";

import { useEffect } from "react";
import { AUTH_SYNC_KEY } from "@/lib/auth-sync";

type AuthEventPayload = {
  type?: "login" | "logout";
};

export default function AuthSessionSync() {
  useEffect(() => {
    function handleStorageEvent(event: StorageEvent) {
      if (event.key !== AUTH_SYNC_KEY || !event.newValue) return;

      try {
        const payload = JSON.parse(event.newValue) as AuthEventPayload;

        if (payload.type === "logout") {
          window.location.href = "/login";
          return;
        }

        if (payload.type === "login") {
          window.location.reload();
        }
      } catch {
        // ignore malformed event payload
      }
    }

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  return null;
}
