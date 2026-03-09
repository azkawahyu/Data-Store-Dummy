import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createEmployee(
  data: Prisma.employeesCreateInput
) {
  console.log("Employee created successfully:", data);
  return prisma.employees.create({
    data
  });

}