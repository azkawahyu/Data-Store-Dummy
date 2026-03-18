import { registerPublicUser } from "@/lib/services/auth/registerPublicUser";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerPublicUser({
      username: body?.username,
      password: body?.password,
      nip: body?.nip,
      email: body?.email,
    });

    return Response.json(
      {
        message: "Registrasi berhasil. Silakan login.",
        data: user,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Public register error:", error);

    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 400 });
    }

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
