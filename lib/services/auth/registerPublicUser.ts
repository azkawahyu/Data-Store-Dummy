import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUser } from "@/lib/services/users/createUser";

const publicRegisterSchema = z.object({
  username: z.string(),
  password: z.string(),
  nip: z.string(),
  email: z.string(),
});

export type PublicRegisterInput = z.infer<typeof publicRegisterSchema>;

export async function registerPublicUser(input: PublicRegisterInput) {
  const parsed = publicRegisterSchema.parse(input);

  const employeeRole = await prisma.roles.findUnique({
    where: { name: "employee" },
    select: { id: true },
  });

  if (!employeeRole) {
    throw new Error("Role employee belum tersedia. Hubungi admin.");
  }

  const user = await createUser({
    username: parsed.username,
    password: parsed.password,
    nip: parsed.nip,
    email: parsed.email,
    role_id: employeeRole.id,
    employee_id: null,
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    link_status: user.link_status,
    link_message: user.link_message,
  };
}
