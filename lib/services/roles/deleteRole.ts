import { prisma } from "@/lib/prisma";

export async function deleteRole(id: string) {
  return prisma.roles.delete({
    where: {
      id: id,
    },
  });
}
