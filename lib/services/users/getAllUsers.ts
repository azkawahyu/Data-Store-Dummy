import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return prisma.users.findMany({ orderBy: { id: "desc" } });
}
