import { hashTemporaryPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type EmployeeAccountInput = {
  username: string;
  nip: string;
  nama: string;
  jabatan: string;
  unit: string;
  status: string;
  alamat: string;
  no_hp: string;
  email: string;
};

export async function createEmployeeAccount(data: EmployeeAccountInput) {
  const username = data.username.trim();
  const nip = data.nip.trim();
  const email = data.email.trim();
  const passwordHash = await hashTemporaryPassword(nip);

  return prisma.$transaction(async (tx) => {
    const [existingUsername, existingEmail] = await Promise.all([
      tx.users.findUnique({ where: { username }, select: { id: true } }),
      tx.employees.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true },
      }),
    ]);

    if (existingUsername) {
      throw new Error("Username sudah digunakan");
    }

    if (existingEmail) {
      throw new Error("Email sudah digunakan");
    }

    const employeeRole = await tx.roles.findUnique({
      where: { name: "employee" },
      select: { id: true },
    });

    if (!employeeRole) {
      throw new Error("Role employee belum tersedia. Hubungi admin.");
    }

    const employee = await tx.employees.create({
      data: {
        nip,
        nama: data.nama.trim(),
        jabatan: data.jabatan.trim(),
        unit: data.unit.trim(),
        status: data.status.trim(),
        alamat: data.alamat.trim(),
        no_hp: data.no_hp.trim(),
        email,
      },
    });

    const user = await tx.users.create({
      data: {
        username,
        password_hash: passwordHash,
        nip,
        email,
        role_id: employeeRole.id,
        employee_id: employee.id,
      },
      select: { id: true, username: true },
    });

    return { employee, user };
  });
}
