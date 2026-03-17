import { prisma } from "@/lib/prisma";

export async function getActivity() {
  return prisma.activity_logs.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
}
