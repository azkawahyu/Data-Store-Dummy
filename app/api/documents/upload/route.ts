import { prisma } from "@/lib/prisma";
import { uploadDocumentSchema } from "@/lib/validations/document.schema";
import { validateFile } from "@/utils/fileUpload";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";

import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// export async function GET() {
//   return Response.json({ message: "Upload endpoint ready" });
// }

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const employee_id = formData.get("employee_id");
    const document_type = formData.get("document_type");
    const other_document_type = formData.get("other_document_type");

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return Response.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // validasi input
    const parsed = uploadDocumentSchema.safeParse({
      employee_id,
      employeeName: formData.get("employeeName") as string | null,
      document_type,
    });

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const isOtherType = parsed.data.document_type === "LAINNYA";
    const otherTypeLabel =
      typeof other_document_type === "string" ? other_document_type.trim() : "";

    if (isOtherType && !otherTypeLabel) {
      return Response.json(
        {
          message: "Nama tipe dokumen wajib diisi saat memilih opsi LAINNYA",
        },
        { status: 400 },
      );
    }

    const employee = await prisma.employees.findUnique({
      where: { id: String(parsed.data.employee_id) },
      select: { nama: true },
    });

    const sanitizeSegment = (value: string) =>
      value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_{2,}/g, "_");

    const employeeSegment = sanitizeSegment(
      employee?.nama || String(parsed.data.employee_id),
    );

    const docTypeSegment = sanitizeSegment(parsed.data.document_type);
    const otherTypeSegment = sanitizeSegment(otherTypeLabel);

    const baseDisplayName = isOtherType
      ? `${employeeSegment}_${docTypeSegment}_${otherTypeSegment}`
      : `${employeeSegment}_${docTypeSegment}`;

    const uploadPath = path.join(process.cwd(), "public/uploads/documents");

    const documentsData = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      validateFile(file);

      const ext = path.extname(file.name);

      const fileName = `${uuidv4()}${ext}`;
      const sequenceSuffix = files.length > 1 ? `_${index + 1}` : "";
      const displayFileName = `${baseDisplayName}${sequenceSuffix}${ext}`;

      const filePath = path.join(uploadPath, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      documentsData.push({
        employee_id: String(parsed.data.employee_id),
        document_type: parsed.data.document_type,
        file_path: `/share/Web/uploads/documents/${parsed.data.employeeName}/${fileName}`,
        uploaded_at: new Date(),
        file_name: displayFileName,
        file_size: file.size,
        mime_type: file.type,
      });
    }

    const result = await prisma.documents.createMany({
      data: documentsData,
    });

    const { userId } = getUser(req as Request);
    await createActivity({
      userId: userId ?? null,
      action: "upload_document",
      description: {
        employeeId: String(parsed.data.employee_id),
        files: documentsData.map((d) => d.file_name),
        message: "uploaded",
      },
    });

    return Response.json({
      message: "Upload berhasil",
      count: result.count,
      files: documentsData,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
