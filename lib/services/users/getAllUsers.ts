import { prisma } from "@/lib/prisma";
import { resolveEmployeeLinkForUser } from "./employeeLinking";

export async function getUsers() {
  const users = await prisma.users.findMany({ orderBy: { id: "desc" } });

  const mappedUsers = await Promise.all(
    users.map(async (user) => {
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
    }),
  );

  return mappedUsers;
}
