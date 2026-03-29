import { Router } from "express";
import multer from "multer";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma";
import { uploadDocumentSchema } from "@/lib/validations/document.schema";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/backend/lib/auth";
import { validateFile } from "@/utils/fileUpload";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = upload.array("files");

function sanitizeSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_");
}

router.post("/api/documents/upload", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const auth = requireJWT(req);
      const form = req.body as Record<string, string | undefined>;
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];

      const employee_id = form.employee_id;
      const document_type = form.document_type;
      const other_document_type = form.other_document_type;
      const employeeNameField = form.employeeName;

      if (!files.length) {
        return res.status(400).json({ message: "File tidak ditemukan" });
      }

      const parsed = uploadDocumentSchema.safeParse({
        employee_id,
        employeeName: employeeNameField,
        document_type,
      });

      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten() });
      }

      const isOtherType = parsed.data.document_type === "LAINNYA";
      const otherTypeLabel =
        typeof other_document_type === "string"
          ? other_document_type.trim()
          : "";

      if (isOtherType && !otherTypeLabel) {
        return res.status(400).json({
          message: "Nama tipe dokumen wajib diisi saat memilih opsi LAINNYA",
        });
      }

      const employee = await prisma.employees.findUnique({
        where: { id: String(parsed.data.employee_id) },
        select: { nama: true },
      });

      const employeeNameFolder =
        parsed.data.employeeName ??
        employee?.nama ??
        String(parsed.data.employee_id);

      const employeeSegment = sanitizeSegment(
        employee?.nama || String(parsed.data.employee_id),
      );
      const docTypeSegment = sanitizeSegment(parsed.data.document_type);
      const otherTypeSegment = sanitizeSegment(otherTypeLabel);

      const baseDisplayName = isOtherType
        ? `${employeeSegment}_${docTypeSegment}_${otherTypeSegment}`
        : `${employeeSegment}_${docTypeSegment}`;

      const uploadPath = path.join(process.cwd(), "public/uploads/documents");
      await mkdir(uploadPath, { recursive: true });

      const documentsData = [] as Array<{
        employee_id: string;
        document_type: string;
        file_path: string;
        uploaded_at: Date;
        file_name: string;
        file_size: number;
        mime_type: string;
      }>;

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        validateFile({ type: file.mimetype, size: file.size } as File);

        const ext = path.extname(file.originalname);
        const fileName = `${uuidv4()}${ext}`;
        const sequenceSuffix = files.length > 1 ? `_${index + 1}` : "";
        const displayFileName = `${baseDisplayName}${sequenceSuffix}${ext}`;
        const filePath = path.join(uploadPath, fileName);

        await writeFile(filePath, file.buffer);

        documentsData.push({
          employee_id: String(parsed.data.employee_id),
          document_type: parsed.data.document_type,
          file_path: `/share/Web/uploads/documents/${employeeNameFolder}/${fileName}`,
          uploaded_at: new Date(),
          file_name: displayFileName,
          file_size: file.size,
          mime_type: file.mimetype,
        });
      }

      const result = await prisma.documents.createMany({ data: documentsData });

      await createActivity({
        userId:
          auth.userId === null || auth.userId === undefined
            ? null
            : String(auth.userId),
        action: "upload_document",
        description: {
          employeeId: String(parsed.data.employee_id),
          files: documentsData.map((d) => d.file_name),
          message: "uploaded",
        },
      });

      return res.json({
        message: "Upload berhasil",
        count: result.count,
        files: documentsData,
      });
    } catch (error: unknown) {
      console.error("Upload error:", error);

      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default router;
