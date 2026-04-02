import type { Request } from "express";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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

export async function requireJWT(req: Request) {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  const tokenFromCookie = getCookieValue(cookieHeader, "token");
  const sessionIdFromCookie = getCookieValue(cookieHeader, "session_id");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = tokenFromCookie ?? tokenFromHeader;

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  if (
    tokenFromCookie &&
    tokenFromHeader &&
    tokenFromHeader !== tokenFromCookie
  ) {
    throw new Error("TOKEN_OUT_OF_SYNC");
  }

  const payload = verifyToken(token);

  const user = await prisma.users.findUnique({
    where: { id: String(payload.userId) },
    select: { password_hash: true },
  });

  if (!user) {
    throw new Error("INVALID_TOKEN");
  }

  if (payload.passwordHash !== user.password_hash) {
    throw new Error("INVALID_TOKEN");
  }

  if (sessionIdFromCookie && payload.sessionId !== sessionIdFromCookie) {
    throw new Error("SESSION_MISMATCH");
  }

  return payload;
}
