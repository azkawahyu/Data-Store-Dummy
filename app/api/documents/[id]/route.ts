import { Prisma } from "@prisma/client";
import { getDocumentById } from "@/lib/services/document/getDocumentById";
import { updateDocument } from "@/lib/services/document/updateDocument";
import { deleteDocument } from "@/lib/services/document/deleteDocument";
import { getRoleById } from "@/lib/services/roles/getRoleById";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const documentGet = await getDocumentById(id);
    const getRole = await getRoleById(
      documentGet?.verified_by?.toString() || "0",
    );

    if (!documentGet) {
      return Response.json({ message: "Document not found" }, { status: 404 });
    }

    const result = {
      id: documentGet.id,
      employee_id: documentGet.employee_id,
      file_name: documentGet.file_path.split("/").pop(),
      file_path: documentGet.file_path,
      verified_by_id: documentGet.verified_by,
      verified_by_role: getRole ? getRole.name : null,
      uploaded_at: documentGet.uploaded_at,
      verified_at: documentGet.verified_at,
    };

    return Response.json(result);
  } catch (error) {
    console.error("GET Document Error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const documentUpdate = await updateDocument(id, body);

    return Response.json(documentUpdate);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "Document not found" }, { status: 404 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const documentId = params.id;

    if (isNaN(Number(documentId))) {
      return Response.json(
        { message: "Document ID tidak valid" },
        { status: 400 },
      );
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return Response.json(
        { message: "Document tidak ditemukan" },
        { status: 404 },
      );
    }

    const filePath = path.join(process.cwd(), "public", document.file_path);

    await unlink(filePath).catch(() => {});

    await deleteDocument(documentId);

    return Response.json({
      success: true,
      message: "Document berhasil dihapus",
    });
  } catch (error: unknown) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ success: false, message }, { status: 500 });
  }
}
