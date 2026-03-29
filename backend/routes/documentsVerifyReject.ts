import { Router } from "express";
import type { Request, Response } from "express";

import { verifyDocument } from "@/lib/services/document/verifyDocument";
import { rejectDocument } from "@/lib/services/document/rejectDocument";
import { getUserById } from "@/lib/services/users/getUserById";
import { getDocumentById } from "@/lib/services/document/getDocumentById";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/backend/lib/auth";

const router = Router();

async function handleDecision(
  req: Request<{ id: string }>,
  res: Response,
  decision: "verified" | "rejected",
) {
  try {
    const { role, userId } = requireJWT(req);

    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifiedByStr = String(userId);
    const userToVerify = await getUserById(verifiedByStr);

    if (!userToVerify) {
      return res
        .status(404)
        .json({ message: "User yang memverifikasi tidak ditemukan" });
    }

    const documentId = String(req.params.id);
    const getDocument = await getDocumentById(documentId);

    if (!getDocument) {
      return res.status(404).json({
        message:
          decision === "verified"
            ? "Document yang akan diverifikasi tidak ditemukan"
            : "Document yang akan ditolak tidak ditemukan",
      });
    }

    const document =
      decision === "verified"
        ? await verifyDocument(documentId, verifiedByStr)
        : await rejectDocument(documentId, verifiedByStr);

    await createActivity({
      userId: verifiedByStr,
      action: `${decision === "verified" ? "verify" : "reject"}_document ${getDocument?.file_name ?? ""}`,
      description: {
        documentId,
        documentName: getDocument?.file_name ?? null,
        [decision === "verified" ? "verifiedBy" : "rejectedBy"]: verifiedByStr,
        message: decision,
      },
    });

    return res.json({
      success: true,
      message:
        decision === "verified"
          ? "Document berhasil diverifikasi"
          : "Document berhasil ditolak",
      data: document,
    });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message });
  }
}

router.patch("/api/documents/verify/:id", async (req, res) => {
  return handleDecision(req, res, "verified");
});

router.patch("/api/documents/reject/:id", async (req, res) => {
  return handleDecision(req, res, "rejected");
});

export default router;
