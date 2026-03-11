import { Prisma } from "@prisma/client";
import { verifyDocument } from "@/lib/services/document/verifyDocument";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log("Document ID:", await params);
    const { id } = await params;
    const documentId = Number(id);

    if (isNaN(documentId)) {
      return Response.json(
        { message: "Document ID tidak valid" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { verified_by } = body;

    if (!verified_by) {
      return Response.json(
        { message: "verified_by wajib diisi" },
        { status: 400 },
      );
    }

    const getEmployee = await getEmployeeById(verified_by.toString());

    if (!getEmployee) {
      return Response.json(
        { message: "Employee yang memverifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    if (verified_by !== 1 && verified_by !== 2) {
      return Response.json(
        { message: "Hanya admin yang dapat memverifikasi dokumen" },
        { status: 403 },
      );
    }

    const document = await verifyDocument(documentId, verified_by);

    return Response.json({
      success: true,
      message: "Document berhasil diverifikasi",
      data: document,
    });
  } catch (error: unknown) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ success: false, message }, { status: 500 });
  }
}
