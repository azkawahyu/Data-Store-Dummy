import { getUsers } from "@/lib/services/users/getAllUsers";
import { createUser } from "@/lib/services/users/createUser";
import { requireRole } from "@/lib/require-role";
import { requireJWT } from "@/lib/auth-jwt";
import { createActivity } from "@/lib/logActivity";
import { userCreateSchema } from "@/lib/validations/userValidations";

export async function GET(request: Request) {
  try {
    const user = requireJWT(request);

    if (!user.role || typeof user.role !== "string") {
      return Response.json(
        { message: "User role is required" },
        { status: 400 },
      );
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

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

    const process = userCreateSchema.safeParse(body);
    if (!process.success) {
      const firstError = process.error.issues[0]?.message ?? "Data tidak valid";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const { username, password, nip, email, role_id, employee_id } =
      process.data;

    const userCreate = await createUser({
      username,
      password,
      nip,
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
          employee_id: userCreate.employee_id,
          link_status: userCreate.link_status,
          link_message: userCreate.link_message,
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
