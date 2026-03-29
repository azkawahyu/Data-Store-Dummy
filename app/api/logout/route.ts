import { NextResponse } from "next/server";
import { getClearedSessionCookieOptions } from "@/lib/cookie-options";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" });

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
