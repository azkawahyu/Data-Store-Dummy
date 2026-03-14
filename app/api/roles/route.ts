import { requireRole } from "@/lib/require-role";
import { requireJWT } from "@/lib/auth-jwt";
import { getRoles } from "@/lib/services/roles/getAllRoles";

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

    const roles = await getRoles();

    return Response.json(roles);
  } catch (error) {
    console.error("GET roles error:", error);

    return Response.json({ message: "Failed to fetch roles" }, { status: 500 });
  }
}
