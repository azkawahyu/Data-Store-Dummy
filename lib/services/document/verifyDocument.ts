import { prisma } from "@/lib/prisma";

export async function verifyDocument(documentId: string, verifiedBy: string) {
  return prisma.documents.update({
    where: {
      id: documentId,
    },
    data: {
      verified_by: verifiedBy,
      verified_at: new Date(),
      status: "verified",
    },
  });
}
