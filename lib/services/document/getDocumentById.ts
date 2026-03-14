import { prisma } from "@/lib/prisma";

export async function getDocumentById(id: string) {
  return prisma.documents.findUnique({
    where: {
      id: id,
    },
  });
}
