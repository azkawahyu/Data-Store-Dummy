import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getClearedSessionCookieOptions } from "@/lib/cookie-options";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicApiRoutes = ["/api/login", "/api/register", "/api/logout"];
  const protectedPages = [
    "/dashboard",
    "/employees",
    "/documents",
    "/profile",
    "/users",
    "/activity",
    "/hr",
  ];

  const isProtectedPage = protectedPages.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!pathname.startsWith("/api")) {
    if (!isProtectedPage) {
      return NextResponse.next();
    }

    const pageToken = request.cookies.get("token")?.value;
    const pageSessionId = request.cookies.get("session_id")?.value;

    if (!pageToken || !pageSessionId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = verifyToken(pageToken);
      if (payload.sessionId !== pageSessionId) {
        throw new Error("SESSION_MISMATCH");
      }
      const role = String(payload.role ?? "").toLowerCase();

      const isUsersPage =
        pathname === "/users" || pathname.startsWith("/users/");
      const isActivityPage =
        pathname === "/activity" || pathname.startsWith("/activity/");
      const isHrPage = pathname === "/hr" || pathname.startsWith("/hr/");
      const isDashboardPage =
        pathname === "/dashboard" || pathname.startsWith("/dashboard/");

      if (role === "employee" && isDashboardPage) {
        return NextResponse.redirect(new URL("/profile/employee", request.url));
      }

      if (role === "hr" && (isUsersPage || isActivityPage)) {
        return NextResponse.redirect(new URL("/hr", request.url));
      }

      if (role !== "hr" && isHrPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set({
        name: "token",
        value: "",
        ...getClearedSessionCookieOptions(),
      });
      response.cookies.set({
        name: "session_id",
        value: "",
        ...getClearedSessionCookieOptions(),
      });
      return response;
    }
  }

  if (publicApiRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokenFromCookie = request.cookies.get("token")?.value;
  const sessionIdFromCookie = request.cookies.get("session_id")?.value;
  const token = tokenFromCookie;

  if (!token || !sessionIdFromCookie) {
    return NextResponse.json(
      { message: "Token tidak ditemukan" },
      { status: 401 },
    );
  }

  if (tokenFromHeader && tokenFromHeader !== tokenFromCookie) {
    return NextResponse.json(
      { message: "Token tab tidak sinkron, silakan refresh/login ulang" },
      { status: 401 },
    );
  }

  try {
    const payload = verifyToken(token);
    if (payload.sessionId !== sessionIdFromCookie) {
      return NextResponse.json(
        { message: "Sesi tidak valid, silakan login kembali" },
        { status: 401 },
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("authorization", `Bearer ${token}`);

    requestHeaders.set("x-user-id", String(payload.userId));
    requestHeaders.set("x-user-role", String(payload.role));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: `Token tidak valid atau expired, error : ${err}` },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/employees/:path*",
    "/documents/:path*",
    "/profile/:path*",
    "/users/:path*",
    "/activity/:path*",
    "/hr/:path*",
  ],
};
