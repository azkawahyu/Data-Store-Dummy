import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/api/login"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Token tidak ditemukan" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.userId));
    requestHeaders.set("x-user-role", String(payload.role));

    console.log("Payload token:", payload);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.log("JWT ERROR:", err);

    return NextResponse.json(
      { message: "Token tidak valid atau expired" },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
