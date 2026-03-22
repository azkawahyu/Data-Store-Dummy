"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import RoleDashboard from "@/components/dashboard/RoleDashboard";
import UploadDocumentModal from "@/components/documents/UploadDocumentModal";
import EmployeeFormModal from "@/components/employee/EmployeeFormModal";
import { getEmployeeConnectionNoticeTitle } from "@/components/common/labels";
import type {
  Employee as EmployeeEntity,
  EmployeeForm as EmployeeFormPayload,
} from "@/types/employee";
import type { Role } from "@/types/role";

type JwtPayload = {
  userId?: string | number;
  sub?: string | number;
  role?: string;
  email?: string;
  nip?: string;
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

type EmployeeSummary = {
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

const validRoles = [
  "admin",
  "employee",
  "hr",
] as const satisfies readonly Role[];

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

export default function EmployeeProfilePage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("employee");
  const [userId, setUserId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [accountNip, setAccountNip] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<UserProfile | null>(null);
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        const parsedRole = (payload?.role ?? "").toString().toLowerCase();
        if (validRoles.includes(parsedRole as Role)) {
          setRole(parsedRole as Role);
        }

        const payloadEmail =
          typeof payload?.email === "string" ? payload.email : null;
        const payloadNip =
          typeof payload?.nip === "string" ? payload.nip : null;
        if (payloadEmail) {
          setAccountEmail(payloadEmail);
        }
        if (payloadNip) {
          setAccountNip(payloadNip);
        }

        const authUserId = String(payload?.userId ?? payload?.sub ?? "");
        if (!authUserId) {
          router.push("/login");
          return;
        }
        setUserId(authUserId);

        const userRes = await apiFetch(`/api/user/${authUserId}`).catch(
          () => null,
        );

        if (!userRes || typeof userRes !== "object") {
          setProfileStatus(null);
          setEmployeeProfile(null);
          setEmployees([]);
          setDocuments([]);
          return;
        }

        const user = userRes as UserProfile;
        setProfileStatus(user);

        if (typeof user.email === "string" && user.email) {
          setAccountEmail(user.email);
        }
        if (typeof user.nip === "string" && user.nip) {
          setAccountNip(user.nip);
        }

        if (!user.employee_id) {
          setEmployeeProfile(null);
          setEmployees([]);
          setDocuments([]);
          return;
        }

        setEmployees([{ id: user.employee_id, unit: null }]);

        const employeeRes = await apiFetch(
          `/api/employees/${user.employee_id}`,
        ).catch(() => null);

        const docsRes = await apiFetch(
          `/api/employees/${user.employee_id}/documents`,
        ).catch(() => null);

        const personalDocs = Array.isArray(docsRes)
          ? docsRes
          : Array.isArray(docsRes?.data)
            ? docsRes.data
            : [];

        setDocuments(personalDocs);

        setEmployeeProfile(
          employeeRes && typeof employeeRes === "object"
            ? (employeeRes as EmployeeProfile)
            : null,
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [router]);

  const employeeId = profileStatus?.employee_id ?? null;

  const initialForm: EmployeeEntity | null = employeeId
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

  const shouldBlockDashboard = role === "employee" && !employeeId;
  const hideEmployeeDashboard = !employeeId || shouldBlockDashboard;

  async function refreshProfile(targetUserId: string) {
    const refreshed = await apiFetch(`/api/user/${targetUserId}`).catch(
      () => null,
    );

    if (refreshed && typeof refreshed === "object") {
      const user = refreshed as UserProfile;
      setProfileStatus(user);

      if (typeof user.email === "string" && user.email) {
        setAccountEmail(user.email);
      }
      if (typeof user.nip === "string" && user.nip) {
        setAccountNip(user.nip);
      }

      if (user.employee_id) {
        setEmployees([{ id: user.employee_id, unit: null }]);
        const profileRes = await apiFetch(
          `/api/employees/${user.employee_id}`,
        ).catch(() => null);
        const docsRes = await apiFetch(
          `/api/employees/${user.employee_id}/documents`,
        ).catch(() => null);
        const personalDocs = Array.isArray(docsRes)
          ? docsRes
          : Array.isArray(docsRes?.data)
            ? docsRes.data
            : [];

        setDocuments(personalDocs);

        setEmployeeProfile(
          profileRes && typeof profileRes === "object"
            ? (profileRes as EmployeeProfile)
            : null,
        );
      } else {
        setEmployeeProfile(null);
        setEmployees([]);
        setDocuments([]);
      }
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

  async function handleSubmit(form: EmployeeFormPayload) {
    try {
      if (!employeeId) {
        const created = await apiFetch("/api/employees", {
          method: "POST",
          body: JSON.stringify({
            ...form,
            linkToCurrentUser: true,
          }),
        });

        const createdEmployee =
          created?.data && typeof created.data === "object"
            ? (created.data as EmployeeProfile)
            : created && typeof created === "object" && "id" in created
              ? (created as EmployeeProfile)
              : null;

        if (!createdEmployee) {
          throw new Error("Gagal membuat data pegawai.");
        }

        setEmployeeProfile(createdEmployee);
        setEmployees([{ id: createdEmployee.id, unit: null }]);
        toast.push("Data pegawai berhasil dibuat.", "success");

        if (userId) {
          await refreshProfile(userId);
        }

        return;
      }

      const updated = await apiFetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      if (!updated || typeof updated !== "object") {
        throw new Error("Gagal memperbarui data pegawai.");
      }

      setEmployeeProfile(updated as EmployeeProfile);
      toast.push("Data pegawai berhasil diperbarui.", "success");

      if (userId) {
        await refreshProfile(userId);
      }
    } catch (error) {
      toast.push("Gagal menyimpan data pegawai.", "error");
      throw error instanceof Error
        ? error
        : new Error("Gagal menyimpan data pegawai.");
    }
  }

  async function handleUploadedDocument() {
    if (!employeeId) return;
    await refreshEmployeeDocuments(employeeId);
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Loading data pegawai...</div>;
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
          <p className="font-semibold">
            {getEmployeeConnectionNoticeTitle(false)}
          </p>
          <p className="mt-1">
            {profileStatus.link_message ??
              "Akun Anda belum terkait ke data pegawai. Jika Anda merasa data sudah dibuat admin, silakan hubungi admin untuk mengaitkan akun ini."}
          </p>
          {role !== "employee" && (
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setOpenEdit(true)}
              >
                Lengkapi Data Pegawai Saya
              </button>
            </div>
          )}
        </div>
      )}

      {!hideEmployeeDashboard && (
        <RoleDashboard
          role="employee"
          employees={employees}
          documents={documents}
          activities={[]}
          employeeProfile={employeeProfile}
          userProfile={profileStatus}
          onUploadDocument={() => setOpenUpload(true)}
        />
      )}

      <UploadDocumentModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={() => {
          void handleUploadedDocument();
        }}
        defaultEmployeeId={employeeId}
        defaultEmployeeName={employeeProfile?.nama ?? null}
        lockEmployeeSelection
      />

      <EmployeeFormModal
        open={openEdit}
        initial={initialForm}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleSubmit}
        title={employeeId ? "Edit Data Pegawai" : "Lengkapi Data Pegawai"}
        submitLabel={employeeId ? "Simpan Perubahan" : "Simpan Data Pegawai"}
        prefillNip={accountNip}
        lockNip={Boolean(accountNip)}
        prefillEmail={accountEmail}
        lockEmail={Boolean(accountEmail)}
      />

      <EmployeeFormModal
        open={shouldBlockDashboard}
        initial={initialForm}
        onClose={() => {}}
        onSubmit={handleSubmit}
        title="Lengkapi Data Pegawai"
        submitLabel="Simpan Data Pegawai"
        hideCloseButton
        hideCancelButton
        disableBackdropClose
        prefillNip={accountNip}
        lockNip={Boolean(accountNip)}
        prefillEmail={accountEmail}
        lockEmail={Boolean(accountEmail)}
      />
    </div>
  );
}
