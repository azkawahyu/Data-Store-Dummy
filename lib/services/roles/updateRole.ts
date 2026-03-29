import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function updateRole(id: string, data: Prisma.rolesUpdateInput) {
  return prisma.roles.update({
    where: {
      id: id,
    },
    data,
  });
}
