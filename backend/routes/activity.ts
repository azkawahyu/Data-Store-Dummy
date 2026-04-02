import { Router } from "express";

import { getActivity } from "@/lib/services/activity/getActivity";
import { requireJWT } from "@/backend/lib/auth";
import { requireRole } from "@/lib/require-role";

const router = Router();

router.get("/api/activity", async (req, res) => {
  try {
    const role = (await requireJWT(req)).role;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ username: "system", role }, ["admin"]);

    const activities = await getActivity();
    return res.json({ success: true, data: activities });
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

    console.error("GET Activity Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
