import { getEmployees } from "@/lib/services/employee/getEmployees";
import { createEmployee } from "@/lib/services/employee/createEmployee";


export async function GET() {
  try {
    const employees = await getEmployees();

    return Response.json(employees);

  } catch (error) {

    console.error("GET employees error:", error);

    return Response.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nama || !body.nip) {
      return Response.json(
        { message: "nama and nip are required" },
        { status: 400 }
      );
    }

    const employee = await createEmployee(body);

    return Response.json(
      {
        message: "Employee created successfully",
        data: employee
      },
      { status: 201 }
    );

  } catch (error) {

    console.error("CREATE employee error:", error);

    return Response.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}