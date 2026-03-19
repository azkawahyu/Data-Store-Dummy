import { prisma } from "@/lib/prisma";

export async function getDocumentByEmpId(employeeId: string) {
  return prisma.documents.findMany({
    where: {
      employee_id: employeeId,
    },
  });
}
