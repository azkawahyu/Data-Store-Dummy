import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  return prisma.users.findUnique({
    where: {
      id: Number(id),
    },
  });
}
