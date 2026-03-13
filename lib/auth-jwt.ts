import { verifyToken } from "./jwt";

export function requireJWT(request: Request) {
  const authHeader = request.headers.get("authorization");

  // token tidak ada
  if (!authHeader) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  // format harus Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("INVALID_TOKEN_FORMAT");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  try {
    return verifyToken(token);
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
