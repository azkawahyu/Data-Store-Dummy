import { prisma } from "@/lib/prisma";

export async function getEmployees() {
  return prisma.employees.findMany({orderBy: {created_at: "desc"}});
}