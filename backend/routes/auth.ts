import { Router } from "express";
import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/jwt";
import { createActivity } from "@/lib/logActivity";
import { registerPublicUser } from "@/lib/services/auth/registerPublicUser";
import {
  getClearedSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/cookie-options";
import {
  compareStoredPassword,
  hashPassword,
  isTemporaryPasswordHash,
} from "@/lib/password";
import { requireJWT } from "@/backend/lib/auth";

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
          const currentUser = await prisma.users.findUnique({
            where: { id: String(payload.userId) },
            select: { password_hash: true },
          });

          if (
            currentUser &&
            currentUser.password_hash === payload.passwordHash
          ) {
            return res.json({
              message: "Sesi aktif ditemukan",
              token: activeToken,
              alreadyLoggedIn: true,
              mustChangePassword: Boolean(payload.mustChangePassword),
            });
          }
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

    const passwordMatch = await compareStoredPassword(
      password,
      user.password_hash,
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    const mustChangePassword = isTemporaryPasswordHash(user.password_hash);

    const sessionId = randomUUID();
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.roles?.name,
      sessionId,
      passwordHash: user.password_hash,
      mustChangePassword,
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
      mustChangePassword,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/change-password", async (req, res) => {
  try {
    const auth = await requireJWT(req);
    const { currentPassword, newPassword, confirmPassword } = req.body ?? {};

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Password baru wajib diisi" });
    }

    if (String(newPassword) !== String(confirmPassword)) {
      return res
        .status(400)
        .json({ message: "Konfirmasi password tidak sama" });
    }

    if (String(newPassword).trim().length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter" });
    }

    const user = await prisma.users.findUnique({
      where: { id: String(auth.userId) },
      select: { id: true, username: true, password_hash: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (!auth.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Password lama wajib diisi" });
      }

      const currentMatch = await compareStoredPassword(
        String(currentPassword),
        user.password_hash,
      );

      if (!currentMatch) {
        return res.status(401).json({ message: "Password lama salah" });
      }
    }

    const nextPasswordHash = await hashPassword(String(newPassword));
    const sessionId = randomUUID();
    const nextToken = signToken({
      userId: user.id,
      username: auth.username,
      role: auth.role,
      sessionId,
      passwordHash: nextPasswordHash,
      mustChangePassword: false,
    });

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: nextPasswordHash },
    });

    await createActivity({
      userId: user.id,
      action: "change_password",
      description: { username: user.username, message: "password changed" },
    });

    res.cookie("token", nextToken, getSessionCookieOptions());
    res.cookie("session_id", sessionId, getSessionCookieOptions());

    return res.json({
      message: "Password berhasil diubah",
      token: nextToken,
      mustChangePassword: false,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_NOT_FOUND") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/logout", async (_req, res) => {
  res.cookie("token", "", getClearedSessionCookieOptions());
  res.cookie("session_id", "", getClearedSessionCookieOptions());

  return res.json({ message: "Logout berhasil" });
});

export default router;
