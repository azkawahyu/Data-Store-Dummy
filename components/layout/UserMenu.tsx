"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

function getRoleLabel(role?: string | null) {
  const normalized = (role ?? "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "employee") return "pegawai";
  if (normalized === "hr") return "umum";
  return "user";
}

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
  const router = useRouter();
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

        const getUserData = await fetch(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!getUserData.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const userDataJson = await getUserData.json();
        const employeeId =
          userDataJson?.data?.employee_id ||
          userDataJson?.employee_id ||
          userId;

        const res = await fetch(`/api/employees/${employeeId}`, {
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
      <style>{`
        @media (max-width: 640px) {
          .user-menu-button span:nth-child(2) {
            display: none;
          }
          .user-menu-dropdown {
            right: -10px !important;
            left: auto;
            min-width: 180px;
          }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="user-menu-button"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(96, 165, 250, 0.5)",
          borderRadius: 8,
          padding: "8px 10px",
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.9)",
          minWidth: "fit-content",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.7)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(37, 99, 235, 0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(96, 165, 250, 0.5)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.15)",
          }}
        >
          👤
        </span>

        <span
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "clamp(12px, 2vw, 13px)",
              color: "#1e293b",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontSize: "clamp(10px, 1.5vw, 11px)",
              color: "#2563eb",
              fontWeight: 500,
            }}
          >
            {getRoleLabel(role)}
          </span>
        </span>
      </button>

      {open && (
        <div
          className="user-menu-dropdown"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 220,
            background: "white",
            border: "1px solid rgba(96, 165, 250, 0.3)",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
            padding: 8,
            zIndex: 20,
            maxWidth: "90vw",
          }}
        >
          <div style={{ padding: "8px 10px", fontSize: 13, color: "#64748b" }}>
            Signed in as
            <div style={{ color: "#0f172a", fontWeight: 600 }}>{name}</div>
            <div
              style={{
                color: "#2563eb",
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              Role: {getRoleLabel(role)}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(96, 165, 250, 0.2)" }} />
          <div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "transparent",
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37, 99, 235, 0.08)";
                e.currentTarget.style.color = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "inherit";
              }}
            >
              Profile Akun
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
