"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import type { Role } from "@/types/role";

type Employee = {
  id: number;
  nama: string;
  jabatan: string;
};

type Document = {
  id: number;
  title: string;
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
  const [role, setRole] = useState<Role>("employee");
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
    }

    async function loadData() {
      try {
        const dataEmployee = await apiFetch("/api/employees");
        const dataDocument = await apiFetch("/api/documents");
        setEmployees(Array.isArray(dataEmployee) ? dataEmployee : []);
        setDocuments(Array.isArray(dataDocument) ? dataDocument : []);
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
    <div className="w-full p-4 sm:p-6 space-y-6">
      <RoleDashboard
        role={role}
        employees={employees}
        documentCount={documents.length}
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
