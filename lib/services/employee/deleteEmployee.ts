import { prisma } from "@/lib/prisma";

export async function deleteEmployee(
  id: string
) {
  console.log("Employee deleted successfully:", id);
  return prisma.employees.delete({
    where: {
      id: Number(id)
    }
  });

}