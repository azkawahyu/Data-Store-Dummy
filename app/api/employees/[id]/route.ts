import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";
import { updateEmployee } from "@/lib/services/employee/updateEmployee";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";

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

    const employeeId = (await params).id;

    if (userId === null || role === null) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employeeOwner = await getEmployeeById(employeeId);

    if (!employeeOwner && role !== "admin") {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();

    const employee = await updateEmployee(id, body);

    await createActivity({
      userId: userId ?? null,
      action: "update_employee",
      description: {
        employeeId: id,
        employeeName: employeeOwner?.nama ?? null,
        message: "updated",
      },
    });

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

    const employeeId = (await params).id;

    if (userId === null || role === null) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employeeOwner = await getEmployeeById(employeeId);

    if (!employeeOwner && role !== "admin") {
      return Response.json({ message: "Employee not found" }, { status: 404 });
    }

    await prisma.employees.delete({
      where: {
        id: employeeId,
      },
    });

    await createActivity({
      userId: userId ?? null,
      action: "delete_employee",
      description: {
        employeeId: employeeId,
        employeeName: employeeOwner?.nama ?? null,
        message: "deleted",
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
