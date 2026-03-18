import { prisma } from "@/lib/prisma";

export async function deleteUser(id: string) {
  return prisma.users.delete({
    where: {
      id: id,
    },
  });
}
