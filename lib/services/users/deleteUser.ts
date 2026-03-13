import { prisma } from "@/lib/prisma";

export async function deleteUser(id: string) {
  console.log("User deleted successfully:", id);
  return prisma.users.delete({
    where: {
      id: Number(id),
    },
  });
}
