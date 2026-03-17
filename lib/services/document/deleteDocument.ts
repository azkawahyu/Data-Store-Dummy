import { prisma } from "@/lib/prisma";

export async function deleteDocument(documentId: string) {
  console.log("Document deleted successfully:", documentId);
  return prisma.documents.delete({
    where: {
      id: documentId,
    },
  });
}
