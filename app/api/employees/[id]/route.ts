import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";
import { updateEmployee } from "@/lib/services/employee/updateEmployee";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const employee = await getEmployeeById(id);

    if (!employee) {
      return Response.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return Response.json(employee);

  } catch (error) {
    console.error("GET Employee Error:", error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const employee = await updateEmployee(id, body);

    return Response.json(employee);

  } catch (error) {

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.employees.delete({
      where: {
        id: Number(id)
      }
    });

    return Response.json({
      message: "Employee deleted successfully"
    });

  } catch (error) {

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    console.error("DELETE employee error:", error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}