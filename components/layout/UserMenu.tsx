"use client";

import { useEffect, useRef, useState } from "react";
import LogoutButton from "../dashboard/LogoutButton";

type JwtPayload = {
  userId?: number | string;
  username?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

type EmployeeResponse = {
  data?: {
    name?: string;
    fullName?: string;
  };
  name?: string;
  fullName?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Employee");
  const [role, setRole] = useState("user");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = parseJwt(token);
        if (!payload) return;

        if (payload.username) setName(payload.username);
        if (payload.role) setRole(payload.role);

        const userId = payload.userId;
        if (!userId) return;

        const res = await fetch(`/api/employees/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) return;

        const data: EmployeeResponse = await res.json();
        const employeeName =
          data?.data?.name ||
          data?.data?.fullName ||
          data?.name ||
          data?.fullName;

        if (employeeName) setName(employeeName);
      } catch {
        // keep fallback
      }
    }

    loadMe();
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          padding: "8px 10px",
          cursor: "pointer",
          background: "white",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#e2e8f0",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          👤
        </span>

        <span
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span style={{ fontWeight: 600, fontSize: 13 }}>{name}</span>
          <span
            style={{
              fontSize: 11,
              color: "#64748b",
              textTransform: "capitalize",
            }}
          >
            {role}
          </span>
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 220,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            padding: 8,
            zIndex: 20,
          }}
        >
          <div style={{ padding: "8px 10px", fontSize: 13, color: "#64748b" }}>
            Signed in as
            <div style={{ color: "#0f172a", fontWeight: 600 }}>{name}</div>
            <div
              style={{
                color: "#475569",
                marginTop: 2,
                textTransform: "capitalize",
              }}
            >
              Role: {role}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0" }} />
          <div>
            <button
              type="button"
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "transparent",
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Profile (soon)
            </button>
          </div>

          <div
            style={{
              textAlign: "left",
              border: "none",
              background: "transparent",
              padding: "8px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
