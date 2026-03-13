import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

interface CreateUserInput {
  username: string;
  password: string;
  email?: string;
  role_id?: number;
  employee_id?: number;
}

export async function createUser(data: CreateUserInput) {
  const { username, password, email, role_id, employee_id } = data;

  // cek username sudah ada
  const existingUser = await prisma.users.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username sudah digunakan");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username,
      password_hash: hashedPassword,
      email,
      role_id,
      employee_id,
    },
  });

  return user;
}
