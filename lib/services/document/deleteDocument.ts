import { prisma } from "@/lib/prisma";

export async function deleteDocument(documentId: string) {
  return prisma.documents.delete({
    where: {
      id: documentId,
    },
  });
}
