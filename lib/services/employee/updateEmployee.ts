import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { resolveUserLinkForEmployee } from "../users/employeeLinking";

export async function updateEmployee(
  id: string,
  data: Prisma.employeesUpdateInput,
) {
  const employee = await prisma.employees.update({
    where: {
      id: id,
    },
    data,
  });

  const resolution = await resolveUserLinkForEmployee({
    nip: employee.nip,
    email: employee.email,
  });

  if (resolution.userId) {
    await prisma.users.update({
      where: { id: resolution.userId },
      data: { employee_id: employee.id },
    });
  }

  return employee;
}
