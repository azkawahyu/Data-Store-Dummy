import { prisma } from "@/lib/prisma";
import { getRoleById } from "@/lib/services/roles/getRoleById";
import { Prisma } from "@prisma/client";
import { deleteRole } from "@/lib/services/roles/deleteRole";
import { updateRole } from "@/lib/services/roles/updateRole";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/lib/auth-jwt";
import { requireRole } from "@/lib/require-role";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = requireJWT(request);

    if (!user.role || typeof user.role !== "string") {
      return Response.json(
        { message: "User role is required" },
        { status: 400 },
      );
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

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
    const user = requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return Response.json(
        { message: "User role is required" },
        { status: 400 },
      );
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const { id } = await params;
    const body = await req.json();

    const role = await updateRole(id, body);

    const { userId } = getUser(req);
    await createActivity({
      userId: userId ?? null,
      action: "update_role",
      description: { roleId: id, message: "updated" },
    });

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
    const user = requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return Response.json(
        { message: "User role is required" },
        { status: 400 },
      );
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const { id } = await params;

    await prisma.employees.delete({
      where: {
        id: id,
      },
    });

    const { userId } = getUser(req);
    await createActivity({
      userId: userId ?? null,
      action: "delete_role",
      description: { roleId: id, message: "deleted" },
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
