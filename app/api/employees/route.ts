import { getEmployees } from "@/lib/services/employee/getEmployees";
import { createEmployee } from "@/lib/services/employee/createEmployee";
import { employeeSchema } from "@/lib/validations/employeeValidations";
import { z } from "zod";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/lib/auth-jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // const { role } = getUser(request);

  // if (role !== "admin") {
  //   return Response.json({ message: "Forbidden" }, { status: 403 });
  // }

  const user = requireJWT(request);

  if (!user.role || typeof user.role !== "string") {
    return Response.json({ message: "User role is required" }, { status: 400 });
  }

  const employees = await getEmployees();

  return Response.json(employees);
}

export async function POST(request: Request) {
  try {
    const { role, userId } = getUser(request);

    if (role !== "admin" && role !== "employee") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const process = employeeSchema.safeParse(body);

    if (!process.success) {
      return Response.json({ message: process.error.issues }, { status: 400 });
    }

    const employee = await createEmployee(process.data);

    // Jika employee role yang mendaftar sendiri, otomatis link ke user
    if (role === "employee" && userId) {
      await prisma.users.update({
        where: { id: userId },
        data: { employee_id: employee.id },
      });
    }

    await createActivity({
      userId: userId ?? null,
      action: "create_employee",
      description: {
        employeeId: employee.id,
        name: (employee.nama as string | null) ?? null,
        message: "created",
      },
    });

    return Response.json(
      {
        message: "Employee created successfully",
        data: employee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ERROR:", error);

    if (error instanceof z.ZodError) {
      return Response.json({ message: error.issues }, { status: 400 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
