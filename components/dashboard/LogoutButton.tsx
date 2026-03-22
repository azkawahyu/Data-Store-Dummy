"use client";

import { broadcastAuthEvent } from "@/lib/auth-sync";

type Props = {
  className?: string;
  label?: string;
};

export default function LogoutButton({ className, label = "Logout" }: Props) {
  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // ignore network error and continue client cleanup
    }

    localStorage.removeItem("token");
    broadcastAuthEvent("logout");
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className={className}
      style={
        className
          ? undefined
          : {
              textAlign: "left",
              border: "none",
              background: "transparent",
              padding: "8px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }
      }
    >
      {label}
    </button>
  );
}
