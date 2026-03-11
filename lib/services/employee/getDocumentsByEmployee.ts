import { prisma } from "@/lib/prisma";

export async function getDocumentsByEmployee(employeeId: number) {
  return prisma.documents.findMany({
    where: {
      employee_id: employeeId,
    },
    orderBy: {
      uploaded_at: "desc",
    },
  });
}
