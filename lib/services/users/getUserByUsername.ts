import { prisma } from "@/lib/prisma";

export async function getUserByUsername(username: string) {
  return prisma.users.findUnique({
    where: {
      username: username,
    },
  });
}
