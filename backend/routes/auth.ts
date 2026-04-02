import { Router } from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/jwt";
import { createActivity } from "@/lib/logActivity";
import { registerPublicUser } from "@/lib/services/auth/registerPublicUser";
import {
  getClearedSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/cookie-options";
import { error } from "console";

const router = Router();

function getCookieValue(cookieHeader: string | undefined, key: string) {
  if (!cookieHeader) return null;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }

  return null;
}

router.post("/api/register", async (req, res) => {
  try {
    const user = await registerPublicUser({
      username: req.body?.username,
      password: req.body?.password,
      nip: req.body?.nip,
      email: req.body?.email,
    });

    return res.status(201).json({
      message: "Registrasi berhasil. Silakan login.",
      data: user,
    });
  } catch (error: unknown) {
    console.error("Public register error:", error);

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const activeToken = getCookieValue(req.headers.cookie, "token");
    const activeSessionId = getCookieValue(req.headers.cookie, "session_id");

    if (activeToken && activeSessionId) {
      try {
        const payload = verifyToken(activeToken);

        if (payload.sessionId === activeSessionId) {
          return res.json({
            message: "Sesi aktif ditemukan",
            token: activeToken,
            alreadyLoggedIn: true,
          });
        }
      } catch (error) {
        console.warn("Token verification failed:", error);
      }
    }

    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const user = await prisma.users.findUnique({
      where: { username },
      include: { roles: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const sessionId = randomUUID();
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.roles?.name,
      sessionId,
    });

    await createActivity({
      userId: user.id,
      action: "login",
      description: { username: user.username, message: "login" },
    });

    res.cookie("token", token, getSessionCookieOptions());
    res.cookie("session_id", sessionId, getSessionCookieOptions());

    return res.json({
      message: "Login berhasil",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/logout", async (_req, res) => {
  res.cookie("token", "", getClearedSessionCookieOptions());
  res.cookie("session_id", "", getClearedSessionCookieOptions());

  return res.json({ message: "Logout berhasil" });
});

export default router;
