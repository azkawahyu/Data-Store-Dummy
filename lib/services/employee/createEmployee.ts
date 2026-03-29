import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { resolveUserLinkForEmployee } from "../users/employeeLinking";

export async function createEmployee(data: Prisma.employeesCreateInput) {
  const employee = await prisma.employees.create({
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
