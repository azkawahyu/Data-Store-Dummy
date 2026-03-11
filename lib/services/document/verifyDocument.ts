import { prisma } from "@/lib/prisma";

export async function verifyDocument(documentId: number, verifiedBy: number) {
  return prisma.documents.update({
    where: {
      id: documentId,
    },
    data: {
      verified_by: verifiedBy,
      verified_at: new Date(),
    },
  });
}
