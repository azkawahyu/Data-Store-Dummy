"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import type { Role } from "@/types/role";

type Employee = {
  id: string;
  unit: string | null;
};

type Document = {
  id: string;
  document_type: string;
  status: string;
  file_name?: string;
  employee_name?: string | null;
  uploaded_at?: string | null;
};

type Activity = {
  id: string;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  username?: string | null;
};

type UserProfile = {
  id: string;
  employee_id: string | null;
  link_status?: "linked_manual" | "linked_auto" | "unlinked" | "conflict";
  link_message?: string;
};

const validRoles = [
  "admin",
  "employee",
  "hr",
] as const satisfies readonly Role[];

export default function DashboardPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [role, setRole] = useState<Role>("employee");
  const [profileStatus, setProfileStatus] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = parseJwt(token);
    let detectedRole: Role = "employee";

    if (payload) {
      const parsedRole = (payload.role ?? "").toString().toLowerCase();
      if (validRoles.includes(parsedRole as Role)) {
        detectedRole = parsedRole as Role;
        setRole(detectedRole);
      } else {
        console.warn("Invalid role in token payload:", parsedRole);
        setRole("employee");
      }

      const userId = (payload.userId ?? payload.sub ?? "").toString();
      if (userId) {
        apiFetch(`/api/user/${userId}`)
          .then((profile) => {
            if (profile && typeof profile === "object") {
              setProfileStatus(profile as UserProfile);
            }
          })
          .catch(() => {
            setProfileStatus(null);
          });
      }
    }

    async function loadData() {
      try {
        const dataEmployee = await apiFetch("/api/employees");
        const dataDocument = await apiFetch("/api/documents");
        const dataActivity = await apiFetch("/api/activity").catch(() => null);
        setEmployees(Array.isArray(dataEmployee) ? dataEmployee : []);
        setDocuments(Array.isArray(dataDocument) ? dataDocument : []);
        if (dataActivity?.data && Array.isArray(dataActivity.data)) {
          setActivities(dataActivity.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-5 space-y-4 sm:space-y-6">
      {profileStatus && !profileStatus.employee_id && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            profileStatus.link_status === "conflict"
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-cyan-200 bg-cyan-50 text-cyan-800"
          }`}
        >
          <p className="font-semibold">Data pegawai belum terhubung</p>
          <p className="mt-1">
            {profileStatus.link_message ??
              "Akun Anda belum terkait ke data pegawai. Jika Anda merasa data sudah dibuat admin, silakan hubungi admin untuk mengaitkan akun ini."}
          </p>
        </div>
      )}

      <RoleDashboard
        role={role}
        employees={employees}
        documents={documents}
        activities={activities}
      />
    </div>
  );
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}
