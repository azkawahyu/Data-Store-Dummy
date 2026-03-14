import { verifyDocument } from "@/lib/services/document/verifyDocument";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const documentId = id; // treat as UUID string

    interface VerifyBody {
      verified_by?: string;
      [key: string]: unknown;
    }

    let body: VerifyBody = {};
    try {
      body = await req.json() as VerifyBody;
    } catch {
      body = {};
    }

    const { verified_by } = body;

    if (!verified_by) {
      return Response.json(
        { message: "verified_by wajib diisi" },
        { status: 400 },
      );
    }

    const verifiedByStr = String(verified_by);

    const getEmployee = await getEmployeeById(verifiedByStr);

    if (!getEmployee) {
      return Response.json(
        { message: "Employee yang memverifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    const document = await verifyDocument(documentId, verifiedByStr);

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
