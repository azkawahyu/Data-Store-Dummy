import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { resolveEmployeeLinkForUser } from "./employeeLinking";
import { userCreateSchema } from "@/lib/validations/userValidations";

interface CreateUserInput {
  username: string;
  password: string;
  nip: string;
  email: string;
  role_id: string;
  employee_id?: string | null;
}

export async function createUser(data: CreateUserInput) {
  const parsed = userCreateSchema.parse(data);
  const { username, password, nip, email, role_id, employee_id } = parsed;

  // cek username sudah ada
  const existingUser = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username sudah digunakan");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const linkResolution = await resolveEmployeeLinkForUser({
    nip,
    email,
    manualEmployeeId: employee_id,
  });

  const user = await prisma.users.create({
    data: {
      username,
      password_hash: hashedPassword,
      nip,
      email,
      role_id,
      employee_id: linkResolution.employeeId,
    },
  });

  return {
    ...user,
    link_status: linkResolution.status,
    link_message: linkResolution.message,
  };
}
