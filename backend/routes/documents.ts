import { Router } from "express";
import { unlink } from "fs/promises";
import path from "path";
import z from "zod";

import { getDocuments } from "@/lib/services/document/getDocuments";
import { createDocument } from "@/lib/services/document/createDocument";
import { getDocumentById } from "@/lib/services/document/getDocumentById";
import { updateDocument } from "@/lib/services/document/updateDocument";
import { deleteDocument } from "@/lib/services/document/deleteDocument";
import { getRoleById } from "@/lib/services/roles/getRoleById";
import { documentCreateSchema } from "@/lib/validations/documentValidations";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/backend/lib/auth";

const router = Router();

router.get("/api/documents", async (req, res) => {
  try {
    const { role } = requireJWT(req);

    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const documents = await getDocuments();
    return res.json(documents);
  } catch (error) {
    console.error("GET documents error:", error);
    return res.status(500).json({ message: "Failed to fetch documents" });
  }
});

router.post("/api/documents", async (req, res) => {
  try {
    const { role, userId } = requireJWT(req);

    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const process = documentCreateSchema.safeParse(req.body);

    if (!process.success) {
      return res.status(400).json({ message: process.error.issues });
    }

    const document = await createDocument({
      ...process.data,
      file_name: req.body.file_name,
      file_size: req.body.file_size,
      mime_type: req.body.mime_type,
    });

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: "create_document",
      description: {
        documentId: document.id,
        fileName: document.file_name,
        message: "created",
      },
    });

    return res.status(201).json({
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {
    console.error("ERROR:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const documentGet = await getDocumentById(id);
    const getRole = await getRoleById(
      documentGet?.verified_by?.toString() || "0",
    );

    if (!documentGet) {
      return res.status(404).json({ message: "Document not found" });
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

    return res.json(result);
  } catch (error) {
    console.error("GET Document Error:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/api/documents/:id", async (req, res) => {
  try {
    const { role, userId } = requireJWT(req);

    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const getDocument = await getDocumentById(id);

    if (!getDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    const documentUpdate = await updateDocument(id, req.body);

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: `update_document ${getDocument.file_name}`,
      description: {
        documentId: id,
        documentName: getDocument?.file_name ?? null,
        message: "updated",
      },
    });

    return res.json(documentUpdate);
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/api/documents/:id", async (req, res) => {
  try {
    const { role, userId } = requireJWT(req);

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id: documentId } = req.params;

    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ message: "Document ID tidak valid" });
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document tidak ditemukan" });
    }

    const filePath = path.join(process.cwd(), "public", document.file_path);
    await unlink(filePath).catch(() => {});

    await deleteDocument(documentId);

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: `delete_document ${document.file_name}`,
      description: {
        documentId,
        documentName: document?.file_name ?? null,
        message: "deleted",
      },
    });

    return res.json({
      success: true,
      message: "Document berhasil dihapus",
    });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message });
  }
});

router.get("/api/documents/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    return res.json(document);
  } catch (error) {
    console.error("GET Document details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
