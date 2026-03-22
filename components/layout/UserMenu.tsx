"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../dashboard/LogoutButton";
import { getRoleLabel as getRoleLabelMaster } from "../common/labels";

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
        .user-menu-button {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--color-indigo-300);
          border-radius: var(--radius-md);
          padding: 8px 10px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.92);
          min-width: fit-content;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .user-menu-button:hover {
          border-color: var(--color-indigo-400);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
        }
        .user-menu-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--gradient-header);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }
        .user-menu-user {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          line-height: 1.2;
        }
        .user-menu-name {
          font-weight: 600;
          font-size: clamp(12px, 2vw, 13px);
          color: var(--color-slate-800);
        }
        .user-menu-role {
          font-size: clamp(10px, 1.5vw, 11px);
          color: var(--color-indigo-500);
          font-weight: 600;
        }
        .user-menu-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          min-width: 236px;
          background: #fff;
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
          padding: 8px;
          z-index: 20;
          max-width: 90vw;
        }
        .user-menu-meta {
          padding: 8px 10px;
          font-size: 13px;
          color: var(--color-slate-500);
          text-align: left;
        }
        .user-menu-meta-name {
          color: var(--color-slate-900);
          font-weight: 700;
          margin-top: 2px;
        }
        .user-menu-meta-role {
          color: var(--color-indigo-500);
          margin-top: 2px;
          font-weight: 600;
        }
        .user-menu-divider {
          border-top: 1px solid rgba(96, 165, 250, 0.2);
          margin: 4px 0;
        }
        .user-menu-actions {
          display: grid;
          gap: 4px;
        }
        .user-menu-item {
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          color: var(--color-slate-700);
          padding: 8px 10px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .user-menu-item:hover {
          background: rgba(37, 99, 235, 0.08);
          color: var(--color-indigo-600);
        }
        .user-menu-item--logout {
          color: #b91c1c;
        }
        .user-menu-item--logout:hover {
          background: #fef2f2;
          color: #b91c1c;
        }
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
      >
        <span aria-hidden className="user-menu-avatar">
          👤
        </span>

        <span className="user-menu-user">
          <span className="user-menu-name">{name}</span>
          <span className="user-menu-role">{getRoleLabelMaster(role)}</span>
        </span>
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-meta">
            Signed in as
            <div className="user-menu-meta-name">{name}</div>
            <div className="user-menu-meta-role">
              {getRoleLabelMaster(role)}
            </div>
          </div>

          <div className="user-menu-divider" />
          <div className="user-menu-actions">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="user-menu-item"
            >
              Profile Akun
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/profile/employee");
              }}
              className="user-menu-item"
            >
              Data Pegawai
            </button>

            <LogoutButton className="user-menu-item user-menu-item--logout" />
          </div>
        </div>
      )}
    </div>
  );
}
