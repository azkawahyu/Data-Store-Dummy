import { prisma } from "@/lib/prisma";

export async function getEmployeeById(id: string) {
  return prisma.employees.findUnique({
    where: {
      id: id,
    },
  });
}
