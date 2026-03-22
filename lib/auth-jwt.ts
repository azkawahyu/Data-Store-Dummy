import { verifyToken } from "./jwt";

function getCookieValue(cookieHeader: string | null, key: string) {
  if (!cookieHeader) return null;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== key) continue;
    return decodeURIComponent(rawValueParts.join("="));
  }

  return null;
}

export function requireJWT(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cookieHeader = request.headers.get("cookie");

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

  const token = tokenFromCookie;

  try {
    const payload = verifyToken(token);

    if (payload.sessionId !== sessionIdFromCookie) {
      throw new Error("SESSION_MISMATCH");
    }

    return payload;
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
