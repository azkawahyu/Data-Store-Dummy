import { prisma } from "@/lib/prisma";

export async function deleteRole(id: string) {
  console.log("Role deleted successfully:", id);
  return prisma.roles.delete({
    where: {
      id: id,
    },
  });
}
