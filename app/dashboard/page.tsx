"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import type {
  Employee as EmployeeEntity,
  EmployeeForm as EmployeeFormPayload,
} from "@/types/employee";
import type { Role } from "@/types/role";

type EmployeeSummary = {
  id: string;
  unit: string | null;
};

type EmployeeProfile = {
  id: string;
  nip?: string | null;
  nama?: string | null;
  jabatan?: string | null;
  unit?: string | null;
  status?: string | null;
  alamat?: string | null;
  email?: string | null;
  no_hp?: string | null;
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
  username?: string | null;
  nip?: string | null;
  email?: string | null;
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

  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [role, setRole] = useState<Role>("employee");
  const [profileStatus, setProfileStatus] = useState<UserProfile | null>(null);
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [accountNip, setAccountNip] = useState<string | null>(null);
  const [requireProfileSetup, setRequireProfileSetup] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const authToken = token;

    async function loadData() {
      try {
        const payload = parseJwt(authToken);
        let detectedRole: Role = "employee";

        if (payload) {
          const parsedRole = (payload.role ?? "").toString().toLowerCase();
          const payloadEmail =
            typeof payload.email === "string" ? payload.email : null;
          const payloadNip =
            typeof payload.nip === "string" ? payload.nip : null;
          if (payloadEmail) {
            setAccountEmail(payloadEmail);
          }
          if (payloadNip) {
            setAccountNip(payloadNip);
          }
          if (validRoles.includes(parsedRole as Role)) {
            detectedRole = parsedRole as Role;
            setRole(detectedRole);
          } else {
            console.warn("Invalid role in token payload:", parsedRole);
            setRole("employee");
          }
        }

        const userId = (payload?.userId ?? payload?.sub ?? "").toString();
        setAuthUserId(userId || null);
        let userProfile: UserProfile | null = null;

        if (userId) {
          const profile = await apiFetch(`/api/user/${userId}`).catch(
            () => null,
          );
          if (profile && typeof profile === "object") {
            userProfile = profile as UserProfile;
            setProfileStatus(userProfile);
            if (typeof userProfile.email === "string" && userProfile.email) {
              setAccountEmail(userProfile.email);
            }
            if (typeof userProfile.nip === "string" && userProfile.nip) {
              setAccountNip(userProfile.nip);
            }
          } else {
            setProfileStatus(null);
          }
        }

        if (detectedRole === "employee") {
          const employeeId = userProfile?.employee_id;

          if (!employeeId) {
            setEmployeeId(null);
            setRequireProfileSetup(true);
            setEmployeeProfile(null);
            setEmployees([]);
            setDocuments([]);
            setActivities([]);
            return;
          }

          setEmployeeId(employeeId);

          const profileRes = await apiFetch(
            `/api/employees/${employeeId}`,
          ).catch(() => null);

          const docsRes = await apiFetch(
            `/api/employees/${employeeId}/documents`,
          );
          const personalDocs = Array.isArray(docsRes)
            ? docsRes
            : Array.isArray(docsRes?.data)
              ? docsRes.data
              : [];

          setEmployeeProfile(
            profileRes && typeof profileRes === "object"
              ? (profileRes as EmployeeProfile)
              : null,
          );

          const resolvedProfile =
            profileRes && typeof profileRes === "object"
              ? (profileRes as EmployeeProfile)
              : null;
          setRequireProfileSetup(!isEmployeeProfileComplete(resolvedProfile));

          setEmployees([{ id: employeeId, unit: null }]);
          setDocuments(personalDocs);
          setActivities([]);

          return;
        }

        setEmployeeId(null);
        setRequireProfileSetup(false);
        setEmployeeProfile(null);
        const dataEmployee = await apiFetch("/api/employees");
        const dataDocument = await apiFetch("/api/documents");
        const dataActivity = await apiFetch("/api/activity").catch(() => null);
        setEmployees(Array.isArray(dataEmployee) ? dataEmployee : []);
        setDocuments(Array.isArray(dataDocument) ? dataDocument : []);
        setActivities(
          dataActivity?.data && Array.isArray(dataActivity.data)
            ? dataActivity.data
            : [],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading dashboard...</div>;
  }

  const shouldBlockDashboard = role === "employee" && requireProfileSetup;

  const hideEmployeeDashboard =
    role === "employee" && (!employeeId || shouldBlockDashboard);

  const employeeFormInitial: EmployeeEntity | null = employeeId
    ? {
        id: employeeId,
        nip: employeeProfile?.nip ?? "",
        nama: employeeProfile?.nama ?? "",
        jabatan: employeeProfile?.jabatan ?? "",
        unit: employeeProfile?.unit ?? "",
        status: employeeProfile?.status === "Kontrak" ? "Kontrak" : "Tetap",
        alamat: employeeProfile?.alamat ?? "",
        no_hp: employeeProfile?.no_hp ?? "",
        email: employeeProfile?.email ?? accountEmail ?? "",
        created_at: "",
        updated_at: "",
      }
    : null;

  async function handleSubmitProfileSetup(form: EmployeeFormPayload) {
    if (!employeeId) {
      // Buat record pegawai baru dan auto-link ke user ini
      const res = await apiFetch("/api/employees", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const created =
        res?.data && typeof res.data === "object"
          ? (res.data as EmployeeProfile)
          : typeof res === "object" && res?.id
            ? (res as EmployeeProfile)
            : null;

      if (created) {
        setEmployeeId(created.id);
        setEmployeeProfile(created);
        setEmployees([{ id: created.id, unit: null }]);

        if (authUserId) {
          const refreshedProfile = await apiFetch(
            `/api/user/${authUserId}`,
          ).catch(() => null);

          if (refreshedProfile && typeof refreshedProfile === "object") {
            setProfileStatus(refreshedProfile as UserProfile);
          } else {
            setProfileStatus((prev) =>
              prev
                ? {
                    ...prev,
                    employee_id: created.id,
                  }
                : null,
            );
          }
        } else {
          setProfileStatus((prev) =>
            prev
              ? {
                  ...prev,
                  employee_id: created.id,
                }
              : null,
          );
        }

        setRequireProfileSetup(false);
      }
      return;
    }

    const updated = await apiFetch(`/api/employees/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (updated && typeof updated === "object") {
      setEmployeeProfile(updated as EmployeeProfile);
      setRequireProfileSetup(false);
    }
  }

  async function refreshEmployeeDocuments(targetEmployeeId: string) {
    const docsRes = await apiFetch(
      `/api/employees/${targetEmployeeId}/documents`,
    ).catch(() => null);

    const personalDocs = Array.isArray(docsRes)
      ? docsRes
      : Array.isArray(docsRes?.data)
        ? docsRes.data
        : [];

    setDocuments(personalDocs);
  }

  async function handleUploadedDocument() {
    if (!employeeId) return;
    await refreshEmployeeDocuments(employeeId);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-5">
      {profileStatus && !profileStatus.employee_id && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
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

      {!hideEmployeeDashboard && (
        <RoleDashboard
          role={role}
          employees={employees}
          documents={documents}
          activities={activities}
          employeeProfile={employeeProfile}
          userProfile={role === "employee" ? profileStatus : null}
          onUploadDocument={() => setOpenUpload(true)}
          onEditEmployeeProfile={() => setOpenEditProfile(true)}
        />
      )}

      <UploadDocumentModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={() => {
          void handleUploadedDocument();
        }}
        defaultEmployeeId={role === "employee" ? employeeId : null}
        defaultEmployeeName={
          role === "employee" ? (employeeProfile?.nama ?? null) : null
        }
        lockEmployeeSelection={role === "employee"}
      />

      <EmployeeFormModal
        open={openEditProfile}
        initial={employeeFormInitial}
        onClose={() => setOpenEditProfile(false)}
        onSubmit={handleSubmitProfileSetup}
        title="Edit Data Pegawai"
        submitLabel="Simpan Perubahan"
        prefillNip={role === "employee" ? accountNip : null}
        lockNip={role === "employee" && Boolean(accountNip)}
        prefillEmail={role === "employee" ? accountEmail : null}
        lockEmail={role === "employee" && Boolean(accountEmail)}
      />

      <EmployeeFormModal
        open={shouldBlockDashboard}
        initial={employeeFormInitial}
        onClose={() => {}}
        onSubmit={handleSubmitProfileSetup}
        title="Lengkapi Data Pegawai"
        submitLabel="Simpan Data Pegawai"
        hideCloseButton
        hideCancelButton
        disableBackdropClose
        prefillNip={role === "employee" ? accountNip : null}
        lockNip={role === "employee" && Boolean(accountNip)}
        prefillEmail={role === "employee" ? accountEmail : null}
        lockEmail={role === "employee" && Boolean(accountEmail)}
      />
    </div>
  );
}

function isEmployeeProfileComplete(profile: EmployeeProfile | null) {
  if (!profile) return false;

  return Boolean(
    profile.nip?.trim() &&
    profile.nama?.trim() &&
    profile.jabatan?.trim() &&
    profile.unit?.trim() &&
    profile.status?.trim() &&
    profile.alamat?.trim() &&
    profile.no_hp?.trim() &&
    profile.email?.trim(),
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
