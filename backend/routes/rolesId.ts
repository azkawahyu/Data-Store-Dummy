import { Router } from "express";

import { prisma } from "@/lib/prisma";
import { getRoleById } from "@/lib/services/roles/getRoleById";
import { deleteRole } from "@/lib/services/roles/deleteRole";
import { updateRole } from "@/lib/services/roles/updateRole";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/backend/lib/auth";
import { requireRole } from "@/lib/require-role";

const router = Router();

router.get("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const role = await getRoleById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.error("GET Role Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const role = await updateRole(req.params.id, req.body);

    await createActivity({
      userId:
        user.userId === null || user.userId === undefined
          ? null
          : String(user.userId),
      action: "update_role",
      description: { roleId: req.params.id, message: "updated" },
    });

    return res.json(role);
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }

    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/api/roles/:id", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    await prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        where: { role_id: req.params.id },
        data: { role_id: null },
      });

      await deleteRole(req.params.id);
    });

    await createActivity({
      userId:
        user.userId === null || user.userId === undefined
          ? null
          : String(user.userId),
      action: "delete_role",
      description: { roleId: req.params.id, message: "deleted" },
    });

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return res.status(404).json({ message: "Role not found" });
    }

    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.error("DELETE role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
