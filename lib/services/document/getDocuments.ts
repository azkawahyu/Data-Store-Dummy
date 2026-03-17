import { prisma } from "@/lib/prisma";

type Employee = {
  nama: string | null;
};

type Users = {
  id?: string | number | null;
  username?: string | null;
  employees?: Employee | null;
};

type Document = {
  employees?: Employee | null;
  verified_by?: string | number | null;
  users?: Users | null;
};

export async function getDocuments() {
  const docs = await prisma.documents.findMany({
    include: {
      employees: true,
      users: {
        include: {
          employees: true,
        },
      },
    },
  });

  return docs.map((d: Document) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null,
  }));
}
