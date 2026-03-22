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

export async function getDocumentsByEmployee(employeeId: string) {
  const docs = await prisma.documents.findMany({
    where: {
      employee_id: employeeId,
    },
    include: {
      employees: true,
      users: {
        include: {
          employees: true,
        },
      },
    },
    orderBy: {
      uploaded_at: "desc",
    },
  });

  return docs.map((d: Document) => ({
    ...d,
    employee_name: d.employees?.nama ?? null,
    verified_by: d.users?.id ?? d.verified_by ?? null,
    verified_by_name: d.users?.username ?? d.users?.employees?.nama ?? null,
  }));
}
