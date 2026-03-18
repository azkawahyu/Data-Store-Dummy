export function formatActivityTime(createdAt?: string | null): string {
  if (!createdAt) return "-";
  try {
    return new Date(createdAt).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return createdAt;
  }
}

type FormatActivityDescriptionParams = {
  action?: string | null;
  description?: string | null;
  username?: string;
};

export function formatActivityDescription({
  action,
  description,
  username,
}: FormatActivityDescriptionParams): string {
  if (!action) return description ?? "-";

  const actor = username ?? "Unknown";

  // parse description jika berupa JSON string
  let desc: Record<string, unknown> = {};
  if (description) {
    try {
      desc = JSON.parse(description);
    } catch {
      return description;
    }
  }

  // login
  if (action === "login") {
    return `${actor} berhasil login`;
  }

  // user
  if (action === "create_user") {
    const name = (desc.username as string) ?? actor;
    return `${actor} membuat user baru: ${name}`;
  }
  if (action === "update_user") {
    const targetName = (desc.username as string) ?? "-";
    return `${actor} memperbarui user dengan nama: ${targetName}`;
  }
  if (action === "delete_user") {
    const targetName = (desc.username as string) ?? "-";
    return `${actor} menghapus user dengan nama: ${targetName}`;
  }

  // role
  if (action === "update_role") {
    const roleId = (desc.roleId as string) ?? "-";
    return `${actor} memperbarui role dengan ID: ${roleId}`;
  }
  if (action === "delete_role") {
    const roleId = (desc.roleId as string) ?? "-";
    return `${actor} menghapus role dengan ID: ${roleId}`;
  }

  // employee
  if (action === "create_employee") {
    const name = (desc.employeeName as string) ?? "-";
    return `${actor} membuat data karyawan baru: ${name}`;
  }
  if (action === "update_employee") {
    const name = (desc.employeeName as string) ?? "-";
    return `${actor} memperbarui data karyawan: ${name}`;
  }
  if (action === "delete_employee") {
    const name = (desc.employeeName as string) ?? "-";
    return `${actor} menghapus data karyawan: ${name}`;
  }

  // document
  if (action === "create_document") {
    const fileName = (desc.fileName as string) ?? "-";
    return `${actor} membuat dokumen: ${fileName}`;
  }
  if (action === "upload_document") {
    const files = desc.files as string[] | undefined;
    const fileList = files?.join(", ") ?? "-";
    return `${actor} mengupload dokumen: ${fileList}`;
  }
  if (action === "delete_document" || action?.startsWith("delete_document ")) {
    const fileName =
      (desc.documentName as string) ??
      action.replace("delete_document", "").trim() ??
      "-";
    return `${actor} menghapus dokumen: ${fileName}`;
  }
  if (action === "update_document" || action?.startsWith("update_document ")) {
    const fileName =
      (desc.documentName as string) ??
      action.replace("update_document", "").trim() ??
      "-";
    return `${actor} memperbarui dokumen: ${fileName}`;
  }
  if (action === "verify_document" || action?.startsWith("verify_document ")) {
    const fileName =
      (desc.documentName as string) ??
      action.replace("verify_document", "").trim() ??
      "-";
    return `${actor} memverifikasi dokumen: ${fileName}`;
  }
  if (action === "reject_document" || action?.startsWith("reject_document ")) {
    const fileName =
      (desc.documentName as string) ??
      action.replace("reject_document", "").trim() ??
      "-";
    return `${actor} menolak dokumen: ${fileName}`;
  }

  // fallback
  return description ?? `${actor} melakukan: ${action}`;
}
