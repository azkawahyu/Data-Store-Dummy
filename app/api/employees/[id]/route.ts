import { prisma } from "@/lib/prisma";

import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const employee = await getEmployeeById(id);

  return Response.json(employee);
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const employee = await prisma.employees.update({
    where: {
      id: Number(params.id)
    },
    data: {
      nama: body.nama
    }
  });

  return Response.json(employee);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.employees.delete({
    where: {
      id: Number(params.id)
    }
  });

  return Response.json({ message: "deleted" });
}