import { Prisma } from "@prisma/client";
import { getUserById } from "@/lib/services/users/getUserById";
import { updateUser } from "@/lib/services/users/updateUser";
import { deleteUser } from "@/lib/services/users/deleteUser";
import { getUser } from "@/lib/getUser";
import { createActivity } from "@/lib/logActivity";
import { userUpdateSchema } from "@/lib/validations/userValidations";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const user = await getUserById(id);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("GET User Error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const process = userUpdateSchema.safeParse(body);
    if (!process.success) {
      const firstError = process.error.issues[0]?.message ?? "Data tidak valid";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const user = await updateUser(id, process.data);

    const { userId } = getUser(req);
    await createActivity({
      userId: userId ?? null,
      action: "update_user",
      description: { userId: id, message: "updated" },
    });

    return Response.json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message === "NIP wajib diisi") {
      return Response.json({ message: error.message }, { status: 400 });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    console.error("PUT user error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteUser(id);

    const { userId } = getUser(req);
    await createActivity({
      userId: userId ?? null,
      action: "delete_user",
      description: { userId: id, message: "deleted" },
    });

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    console.error("DELETE user error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
