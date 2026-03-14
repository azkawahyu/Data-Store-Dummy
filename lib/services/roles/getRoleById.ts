import { prisma } from "@/lib/prisma";

export async function getRoleById(id: string) {
  return prisma.roles.findUnique({
    where: {
      id: id,
    },
  });
}
