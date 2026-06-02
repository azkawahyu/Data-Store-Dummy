import { prisma } from "@/lib/prisma";

export async function deleteUser(id: string) {
  const [, , deletedUser] = await prisma.$transaction([
    prisma.activity_logs.updateMany({
      where: { user_id: id },
      data: { user_id: null },
    }),
    prisma.documents.updateMany({
      where: { verified_by: id },
      data: { verified_by: null },
    }),
    prisma.users.delete({
      where: { id },
    }),
  ]);

  return deletedUser;
}
