import { getEmployees } from "@/lib/services/employee/getEmployees";
import { createEmployee } from "@/lib/services/employee/createEmployee";
import { employeeSchema } from "@/lib/validations/employeeValidations";
import { z } from "zod";
import { requireJWT } from "@/lib/auth-jwt";

export async function GET(request: Request) {
  try {
    const user = requireJWT(request);

    console.log("User dari token:", user);

    const employees = await getEmployees();

    return Response.json(employees);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TOKEN_NOT_FOUND") {
        return Response.json(
          { message: "Token tidak ditemukan" },
          { status: 401 },
        );
      }

      if (error.message === "INVALID_TOKEN_FORMAT") {
        return Response.json(
          { message: "Format token salah" },
          { status: 401 },
        );
      }

      if (error.message === "INVALID_TOKEN") {
        return Response.json(
          { message: "Token tidak valid atau expired" },
          { status: 401 },
        );
      }
    }

    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
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
