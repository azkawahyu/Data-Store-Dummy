import { Router } from "express";

import { getRoles } from "@/lib/services/roles/getAllRoles";
import { requireRole } from "@/lib/require-role";
import { requireJWT } from "../lib/auth";

const router = Router();

router.get("/api/roles", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const roles = await getRoles();
    return res.json(roles);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
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

    console.error("GET roles error:", error);
    return res.status(500).json({ message: "Failed to fetch roles" });
  }
});

export default router;
