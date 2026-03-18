import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { resolveEmployeeLinkForUser } from "./employeeLinking";

interface CreateUserInput {
  username: string;
  password: string;
  nip?: string;
  email?: string;
  role_id?: string;
  employee_id?: string;
}

export async function createUser(data: CreateUserInput) {
  const { username, password, nip, email, role_id, employee_id } = data;

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
      nip: nip || null,
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
