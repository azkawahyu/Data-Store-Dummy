import { getUsers } from "@/lib/services/users/getAllUsers";
import { createUser } from "@/lib/services/users/createUser";
import { requireRole } from "@/lib/require-role";
import { requireJWT } from "@/lib/auth-jwt";
import { createActivity } from "@/lib/logActivity";

export async function GET() {
  try {
    const users = await getUsers();

    return Response.json(users);
  } catch (error) {
    console.error("GET users error:", error);

    return Response.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requireJWT(request);

    if (!user.role || typeof user.role !== "string") {
      return Response.json(
        { message: "User role is required" },
        { status: 400 },
      );
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const body = await request.json();

    const { username, password, email, role_id, employee_id } = body;

    if (!username || !password) {
      return Response.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const userCreate = await createUser({
      username,
      password,
      email,
      role_id,
      employee_id,
    });

    await createActivity({
      userId: userCreate.id ?? null,
      action: "create_user",
      description: {
        userId: userCreate.id,
        username: userCreate.username,
        message: "created",
      },
    });

    return Response.json(
      {
        message: "User berhasil dibuat",
        data: {
          id: userCreate.id,
          username: userCreate.username,
          email: userCreate.email,
          role: {
            role_id: userCreate.role_id,
          },
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create user error:", error);

    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 400 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
