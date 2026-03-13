import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log("Login attempt:", { username, password });

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

    console.log(
      "Comparing password:",
      password,
      "with hash:",
      user.password_hash,
    );

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return Response.json(
        { message: "Username atau Password salah" },
        { status: 401 },
      );
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.roles?.name,
    });

    return Response.json({
      message: "Login berhasil",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
