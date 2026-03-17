import { prisma } from "./prisma";

export async function createActivity(opts: {
  userId?: string | null;
  action: string;
  description?: unknown | null;
}) {
  const { userId = null, action, description = null } = opts;

  // If description is an object, stringify it so it can be stored in the text column.
  const desc =
    description === null || typeof description === "string"
      ? (description as string | null)
      : JSON.stringify(description);

  return prisma.activity_logs.create({
    data: {
      user_id: userId,
      action,
      description: desc,
    },
  });
}
