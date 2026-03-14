import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function updateEmployee(
  id: string,
  data: Prisma.employeesUpdateInput,
) {
  return prisma.employees.update({
    where: {
      id: id,
    },
    data,
  });
}
