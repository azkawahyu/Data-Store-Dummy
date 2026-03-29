import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { resolveUserLinkForEmployee } from "../users/employeeLinking";

export async function updateEmployee(
  id: string,
  data: Prisma.employeesUpdateInput,
) {
  const directLinkedUser = await prisma.users.findFirst({
    where: { employee_id: id },
    select: { id: true, email: true, nip: true },
  });

  const nextEmployeeData: Prisma.employeesUpdateInput = { ...data };

  if (directLinkedUser) {
    const requestedEmail =
      typeof data.email === "string" ? data.email.trim() : null;
    const requestedNip = typeof data.nip === "string" ? data.nip.trim() : null;

    const shouldUpdateUserEmail =
      requestedEmail !== null && requestedEmail !== directLinkedUser.email;
    const shouldUpdateUserNip =
      requestedNip !== null && requestedNip !== directLinkedUser.nip;

    let masterEmail = directLinkedUser.email;
    let masterNip = directLinkedUser.nip;

    if (shouldUpdateUserEmail || shouldUpdateUserNip) {
      const updatedUser = await prisma.users.update({
        where: { id: directLinkedUser.id },
        data: {
          employee_id: id,
          ...(shouldUpdateUserEmail ? { email: requestedEmail } : {}),
          ...(shouldUpdateUserNip ? { nip: requestedNip } : {}),
        },
        select: { email: true, nip: true },
      });

      masterEmail = updatedUser.email;
      masterNip = updatedUser.nip;
    }

    if (masterEmail) {
      nextEmployeeData.email = masterEmail;
    }

    if (masterNip) {
      nextEmployeeData.nip = masterNip;
    }
  }

  const employee = await prisma.employees.update({
    where: {
      id: id,
    },
    data: nextEmployeeData,
  });

  if (directLinkedUser) {
    return employee;
  }

  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email,
  });

  const linkedUserId = resolution.userId;

  if (linkedUserId) {
    await prisma.users.update({
      where: { id: linkedUserId },
      data: { employee_id: employee.id },
    });
  }

  return employee;
}
