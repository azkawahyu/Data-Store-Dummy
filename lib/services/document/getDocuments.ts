import { prisma } from "@/lib/prisma";

export async function getDocuments() {
  console.log("Fetching documents from database...");
  return prisma.documents.findMany();
}
