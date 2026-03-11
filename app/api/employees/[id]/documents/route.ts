import { getDocumentsByEmployee } from "@lib/services/employee/getDocumentsByEmployee";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const employeeId = Number(params.id);

    if (isNaN(employeeId)) {
      return Response.json(
        { message: "Employee ID tidak valid" },
        { status: 400 },
      );
    }

    const documents = await getDocumentsByEmployee(employeeId);

    return Response.json({
      success: true,
      data: documents,
    });
  } catch (error: unknown) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ success: false, message }, { status: 500 });
  }
}
