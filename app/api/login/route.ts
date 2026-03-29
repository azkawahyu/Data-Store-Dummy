import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import { createActivity } from "@/lib/logActivity";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSessionCookieOptions } from "@/lib/cookie-options";

export async function POST(request: NextRequest) {
  try {
    const activeToken = request.cookies.get("token")?.value;
    const activeSessionId = request.cookies.get("session_id")?.value;

    if (activeToken && activeSessionId) {
      try {
        const payload = verifyToken(activeToken);

        if (payload.sessionId === activeSessionId) {
          return NextResponse.json({
            message: "Sesi aktif ditemukan",
            token: activeToken,
            alreadyLoggedIn: true,
          });
        }
      } catch {
        // ignore invalid active session and continue normal login flow
      }
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.users.findUnique({
      where: { username },
      include: { roles: true },
    });

    if (!user) {
      return Response.json(
        { message: "User tidak ditemukan" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return Response.json(
        { message: "Username atau Password salah" },
        { status: 401 },
      );
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

    const response = NextResponse.json({
      message: "Login berhasil",
      token,
    });

    response.cookies.set({
      name: "token",
      value: token,
      ...getSessionCookieOptions(),
    });

    response.cookies.set({
      name: "session_id",
      value: sessionId,
      ...getSessionCookieOptions(),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
