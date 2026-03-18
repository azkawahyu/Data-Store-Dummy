import { prisma } from "@/lib/prisma";
import { resolveEmployeeLinkForUser } from "./employeeLinking";

export async function getUserById(id: string) {
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) return null;

  const resolution = await resolveEmployeeLinkForUser({
    nip: user.nip,
    email: user.email,
    manualEmployeeId: user.employee_id,
  });

  return {
    ...user,
    link_status: resolution.status,
    link_message: resolution.message,
  };
}
