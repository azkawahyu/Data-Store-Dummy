"use client";

import { useSyncExternalStore } from "react";
import AppShell from "@/components/layout/AppShell";

function getRoleFromToken() {
  try {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { role?: string };
    return (payload.role ?? "").toLowerCase();
  } catch {
    return null;
  }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return getRoleFromToken() !== "employee";
}

function getServerSnapshot() {
  return false;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showSidebar = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return <AppShell showSidebar={showSidebar}>{children}</AppShell>;
}
