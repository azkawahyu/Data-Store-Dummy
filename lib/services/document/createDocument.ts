import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDocument(
  data: Prisma.documentsCreateInput
) {
  console.log("Document created successfully:", data);
  return prisma.documents.create({
    data
  });

}