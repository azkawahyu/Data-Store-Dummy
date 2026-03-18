import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { resolveEmployeeLinkForUser } from "./employeeLinking";

export async function updateUser(
  id: string,
  data: Prisma.usersUncheckedUpdateInput,
) {
  const currentUser = await prisma.users.findUnique({
    where: { id },
    select: { id: true, username: true, nip: true, email: true },
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
    nip: nextNip,
    email: nextEmail,
    manualEmployeeId: nextEmployeeId,
  });

  const updated = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      ...data,
      employee_id: linkResolution.employeeId,
    },
  });

  return {
    ...updated,
    link_status: linkResolution.status,
    link_message: linkResolution.message,
  };
}
