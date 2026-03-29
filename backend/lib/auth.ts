import type { Request } from "express";
import { verifyToken } from "@/lib/jwt";

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

export function requireJWT(req: Request) {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  const tokenFromCookie = getCookieValue(cookieHeader, "token");
  const sessionIdFromCookie = getCookieValue(cookieHeader, "session_id");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!tokenFromCookie || !sessionIdFromCookie) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  if (tokenFromHeader && tokenFromHeader !== tokenFromCookie) {
    throw new Error("TOKEN_OUT_OF_SYNC");
  }

  const payload = verifyToken(tokenFromCookie);

  if (payload.sessionId !== sessionIdFromCookie) {
    throw new Error("SESSION_MISMATCH");
  }

  return payload;
}
