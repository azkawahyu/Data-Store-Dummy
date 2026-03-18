import { prisma } from "@/lib/prisma";

export async function deleteEmployee(id: string) {
  return prisma.employees.delete({
    where: {
      id: id,
    },
  });
}
