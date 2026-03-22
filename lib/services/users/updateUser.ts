import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { resolveEmployeeLinkForUser } from "./employeeLinking";

export async function updateUser(
  id: string,
  data: Prisma.usersUncheckedUpdateInput,
) {
  const currentUser = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true,
      employee_id: true,
    },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  const nextNip =
    typeof data.nip === "string"
      ? data.nip
      : data.nip === null
        ? null
        : (currentUser.nip ?? null);
  const normalizedNip = nextNip?.trim() ?? "";

  if (!normalizedNip) {
    throw new Error("NIP wajib diisi");
  }

  const nextEmail =
    typeof data.email === "string"
      ? data.email
      : data.email === null
        ? null
        : currentUser.email;

  let nextEmployeeId: string | null | undefined;
  if (typeof data.employee_id === "string") {
    nextEmployeeId = data.employee_id;
  } else if (data.employee_id === null) {
    nextEmployeeId = null;
  }

  const linkResolution = await resolveEmployeeLinkForUser({
    nip: normalizedNip,
    email: nextEmail,
    manualEmployeeId: nextEmployeeId,
  });

  const updated = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      ...data,
      nip: normalizedNip,
      employee_id: linkResolution.employeeId,
    },
  });

  // Sinkronkan ke data pegawai jika:
  // (a) employee baru dikaitkan — sync email + nip sekaligus, atau
  // (b) masih employee yang sama tapi email berubah — sync email saja
  const resolvedEmployeeId = linkResolution.employeeId ?? updated.employee_id;
  const isNewLink =
    resolvedEmployeeId && resolvedEmployeeId !== currentUser.employee_id;
  const isEmailChanged =
    resolvedEmployeeId && nextEmail && nextEmail !== currentUser.email;

  if (isNewLink) {
    await prisma.employees
      .update({
        where: { id: resolvedEmployeeId },
        data: {
          ...(nextEmail ? { email: nextEmail } : {}),
          ...(normalizedNip ? { nip: normalizedNip } : {}),
        },
      })
      .catch(() => {});
  } else if (isEmailChanged) {
    await prisma.employees
      .update({
        where: { id: resolvedEmployeeId },
        data: { email: nextEmail as string },
      })
      .catch(() => {
        // Abaikan jika employee tidak ditemukan (edge case)
      });
  }

  return {
    ...updated,
    link_status: linkResolution.status,
    link_message: linkResolution.message,
  };
}
