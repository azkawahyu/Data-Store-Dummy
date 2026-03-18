import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDocument(data: Prisma.documentsCreateInput) {
  return prisma.documents.create({
    data,
  });
}
