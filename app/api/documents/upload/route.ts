import { prisma } from "@/lib/prisma";
import { uploadDocumentSchema } from "@/lib/validations/document.schema";
import { validateFile } from "@/utils/fileUpload";

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
      document_type,
    });

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const uploadPath = path.join(process.cwd(), "public/uploads/documents");

    const documentsData = [];

    for (const file of files) {
      validateFile(file);

      const ext = path.extname(file.name);

      const fileName = `${uuidv4()}${ext}`;

      const filePath = path.join(uploadPath, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      documentsData.push({
        employee_id: parsed.data.employee_id,
        document_type: parsed.data.document_type,
        file_path: `/uploads/documents/${fileName}`,
        uploaded_at: new Date(),
      });
    }

    const result = await prisma.documents.createMany({
      data: documentsData,
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
