import { rejectDocument } from "@/lib/services/document/rejectDocument";
import { getUserById } from "@/lib/services/users/getUserById";
import { createActivity } from "@/lib/logActivity";
import { getDocumentById } from "@/lib/services/document/getDocumentById";
import { getUser } from "@/lib/getUser";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { role, userId } = getUser(req);

    if (role !== "admin" && role !== "hr") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const documentId = id;

    interface RejectBody {
      verified_by?: string;
      [key: string]: unknown;
    }

    let body: RejectBody = {};
    try {
      body = (await req.json()) as RejectBody;
    } catch {
      body = {};
    }

    const verifiedByStr = String(userId);

    const getUser = await getUserById(verifiedByStr);

    if (!getUser) {
      return Response.json(
        { message: "User yang memverifikasi tidak ditemukan" },
        { status: 404 },
      );
    }

    const getDocument = await getDocumentById(documentId);

    if (!getDocument) {
      return Response.json(
        { message: "Document yang akan ditolak tidak ditemukan" },
        { status: 404 },
      );
    }

    const document = await rejectDocument(documentId, verifiedByStr);

    await createActivity({
      userId: verifiedByStr,
      action: `reject_document ${getDocument?.file_name ?? ""}`,
      description: {
        documentId: documentId,
        documentName: getDocument?.file_name ?? null,
        rejectedBy: verifiedByStr,
        message: "rejected",
      },
    });

    return Response.json({
      success: true,
      message: "Document berhasil ditolak",
      data: document,
    });
  } catch (error: unknown) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ success: false, message }, { status: 500 });
  }
}
