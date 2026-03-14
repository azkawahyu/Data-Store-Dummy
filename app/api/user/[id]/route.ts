import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getUserById } from "@/lib/services/users/getUserById";
import { updateUser } from "@/lib/services/users/updateUser";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const user = await getUserById(id);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("GET User Error:", error);

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

    const user = await updateUser(id, body);

    return Response.json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "User not found" }, { status: 404 });
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
