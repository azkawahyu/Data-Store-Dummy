import { getUser } from "@/lib/getUser";
import { getActivity } from "@/lib/services/activity/getActivity";

export async function GET(request: Request) {
  try {
    const role = getUser(request).role;

    if (role !== "admin") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const activities = await getActivity();

    return Response.json({ success: true, data: activities });
  } catch (error) {
    console.error("GET Activity Error:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
