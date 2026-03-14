import { getEmployees } from "@/lib/services/employee/getEmployees";
import { createEmployee } from "@/lib/services/employee/createEmployee";
import { employeeSchema } from "@/lib/validations/employeeValidations";
import { z } from "zod";
import { getUser } from "@/lib/getUser";

export async function GET(request: Request) {
  const { role } = getUser(request);

  if (role !== "admin") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const employees = await getEmployees();

  return Response.json(employees);
}

export async function POST(request: Request) {
  try {
    const { role } = getUser(request);

    if (role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const process = employeeSchema.safeParse(body);

    if (!process.success) {
      return Response.json({ message: process.error.issues }, { status: 400 });
    }

    const employee = await createEmployee(process.data);

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
