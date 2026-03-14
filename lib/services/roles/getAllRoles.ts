import { prisma } from "@/lib/prisma";

export async function getRoles() {
  return prisma.roles.findMany({ orderBy: { id: "desc" } });
}
