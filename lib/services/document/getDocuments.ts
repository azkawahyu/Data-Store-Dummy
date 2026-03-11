import { prisma } from "@/lib/prisma";

export async function getDocuments() {
  return prisma.documents.findMany({
    orderBy: { id: "desc" },
  });
}
