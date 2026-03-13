import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function updateUser(id: string, data: Prisma.usersUpdateInput) {
  return prisma.users.update({
    where: {
      id: Number(id),
    },
    data,
  });
}
