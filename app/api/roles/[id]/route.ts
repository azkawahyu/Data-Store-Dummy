import { prisma } from "@/lib/prisma";
import { getRoleById } from "@/lib/services/roles/getRoleById";
import { Prisma } from "@prisma/client";
import { deleteRole } from "@/lib/services/roles/deleteRole";
import { updateRole } from "@/lib/services/roles/updateRole";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const role = await getRoleById(id);

    if (!role) {
      return Response.json({ message: "Role not found" }, { status: 404 });
    }

    return Response.json(role);
  } catch (error) {
    console.error("GET Role Error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const role = await updateRole(id, body);

    return Response.json(role);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Role not found" }, { status: 404 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.employees.delete({
      where: {
        id: id,
      },
    });

    return Response.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    console.error("DELETE employee error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
