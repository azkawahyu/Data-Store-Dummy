import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function updateDocument(
  id: string,
  data: Prisma.documentsUpdateInput,
) {
  return prisma.documents.update({
    where: {
      id: id,
    },
    data,
  });
}
