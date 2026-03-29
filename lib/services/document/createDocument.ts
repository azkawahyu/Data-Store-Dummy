import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function createDocument(data: Prisma.documentsCreateInput) {
  return prisma.documents.create({
    data,
  });
}
