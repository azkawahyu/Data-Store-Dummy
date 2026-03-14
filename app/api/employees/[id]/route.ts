import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";
import { updateEmployee } from "@/lib/services/employee/updateEmployee";
import { getUser } from "@/lib/getUser";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { role } = getUser(request);

    if (role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    const { id } = await context.params;

    const employee = await getEmployeeById(id);

    if (!employee) {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    return Response.json(employee);
  } catch (error) {
    console.error("GET Employee Error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId, role } = getUser(request);

    if (userId === null || role === null) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employeeOwner = await getEmployeeById(userId);

    if (!employeeOwner) {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    const employee = await updateEmployee(id, body);

    return Response.json(employee);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId, role } = getUser(request);

    if (userId === null || role === null) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employeeOwner = await getEmployeeById(userId);

    if (!employeeOwner || role !== "admin") {
      return Response.json({ message: "Unauthorized User" }, { status: 404 });
    }

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
