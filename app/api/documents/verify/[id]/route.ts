import { verifyDocument } from "@/lib/services/document/verifyDocument";
import { getUserById } from "@/lib/services/users/getUserById";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";
import { getDocumentById } from "@/lib/services/document/getDocumentById";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { role, userId } = getUser(request);

    if (role !== "admin" && role !== "hr") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const documentId = id;

    interface VerifyBody {
      verified_by?: string;
      [key: string]: unknown;
    }

    let body: VerifyBody = {};
    try {
      body = (await request.json()) as VerifyBody;
    } catch {
      body = {};
    }

    const verifiedByStr = String(userId);

    const userToVerify = await getUserById(verifiedByStr);

    if (!userToVerify) {
      return Response.json(
        { message: "User yang memverifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    const getDocument = await getDocumentById(documentId);

    if (!getDocument) {
      return Response.json(
        { message: "Document yang akan diverifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    const document = await verifyDocument(documentId, verifiedByStr);

    await createActivity({
      userId: verifiedByStr,
      action: `verify_document ${getDocument?.file_name ?? ""}`,
      description: {
        documentId: documentId,
        documentName: getDocument?.file_name ?? null,
        verifiedBy: verifiedByStr,
        message: "verified",
      },
    });

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
