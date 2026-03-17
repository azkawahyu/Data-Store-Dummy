import { prisma } from "@/lib/prisma";

export async function rejectDocument(documentId: string, verifiedBy: string) {
  const doc = await prisma.documents.update({
    where: { id: documentId },
    data: {
      verified_by: verifiedBy,
      verified_at: new Date(),
      status: "rejected",
    },
    include: {
      users: {
        include: {
          employees: true,
        },
      },
    },
  });

  return {
    id: doc.id,
    status: doc.status,
    verified_at: doc.verified_at,
    verified_by: doc.verified_by,
    // prefer users.username since verifier is a user (admin), fallback to employee name
    verified_by_name: doc.users?.username ?? doc.users?.employees?.nama ?? null,
    file_path: doc.file_path,
  };
}
