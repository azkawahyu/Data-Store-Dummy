import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  return prisma.users.findFirst({
    where: {
      email: email,
    },
  });
}
