import { prisma } from "@/lib/prisma";

type EmployeeCandidate = {
  id: string;
  nip: string;
  email: string | null;
};

export type LinkStatus =
  | "linked_manual"
  | "linked_auto"
  | "unlinked"
  | "conflict";

export type LinkResolution = {
  employeeId: string | null;
  status: LinkStatus;
  message: string;
};

function normalizeValue(value?: string | null) {
  return value?.trim() ?? "";
}

function normalizeEmail(email?: string | null) {
  const value = normalizeValue(email).toLowerCase();
  return value.length > 0 ? value : "";
}

function normalizeNip(nip?: string | null) {
  const value = normalizeValue(nip);
  return value.length > 0 ? value : "";
}

function evaluateCandidates({
  matchesByNip,
  matchesByEmail,
}: {
  matchesByNip: EmployeeCandidate[];
  matchesByEmail: EmployeeCandidate[];
}): LinkResolution {
  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;

  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      employeeId: null,
      status: "conflict",
      message:
        "Ditemukan lebih dari satu kandidat pegawai. Perlu pengaitan manual.",
    };
  }

  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      employeeId: null,
      status: "conflict",
      message:
        "Data NIP dan email mengarah ke pegawai berbeda. Perlu pengaitan manual.",
    };
  }

  if (nipSingle) {
    return {
      employeeId: nipSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan NIP.",
    };
  }

  if (emailSingle) {
    return {
      employeeId: emailSingle.id,
      status: "linked_auto",
      message: "Akun berhasil dikaitkan otomatis berdasarkan email.",
    };
  }

  return {
    employeeId: null,
    status: "unlinked",
    message: "Belum ada pegawai yang cocok otomatis.",
  };
}

export async function resolveEmployeeLinkForUser(input: {
  nip?: string | null;
  email?: string | null;
  manualEmployeeId?: string | null;
}): Promise<LinkResolution> {
  const manualEmployeeId = normalizeValue(input.manualEmployeeId);
  if (manualEmployeeId) {
    return {
      employeeId: manualEmployeeId,
      status: "linked_manual",
      message: "Akun dikaitkan manual oleh admin.",
    };
  }

  const normalizedEmail = normalizeEmail(input.email);
  const normalizedNip = normalizeNip(input.nip);

  if (!normalizedEmail && !normalizedNip) {
    return {
      employeeId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email).",
    };
  }

  const candidates = await prisma.employees.findMany({
    where: {
      OR: [
        normalizedNip ? { nip: normalizedNip } : undefined,
        normalizedEmail
          ? {
              email: {
                equals: normalizedEmail,
                mode: "insensitive" as const,
              },
            }
          : undefined,
      ].filter((v): v is NonNullable<typeof v> => v != null),
    },
    select: {
      id: true,
      nip: true,
      email: true,
    },
  });

  const matchesByNip = normalizedNip
    ? candidates.filter(
        (candidate) => normalizeNip(candidate.nip) === normalizedNip,
      )
    : [];

  const matchesByEmail = normalizedEmail
    ? candidates.filter(
        (candidate) => normalizeEmail(candidate.email) === normalizedEmail,
      )
    : [];

  return evaluateCandidates({ matchesByNip, matchesByEmail });
}

export async function resolveUserLinkForEmployee(input: {
  nip?: string | null;
  email?: string | null;
}): Promise<{ userId: string | null; status: LinkStatus; message: string }> {
  const normalizedNip = normalizeNip(input.nip);
  const normalizedEmail = normalizeEmail(input.email);

  if (!normalizedNip && !normalizedEmail) {
    return {
      userId: null,
      status: "unlinked",
      message: "Tidak ada data pencocokan otomatis (NIP/email).",
    };
  }

  const users = await prisma.users.findMany({
    where: {
      employee_id: null,
      OR: [
        normalizedNip ? { nip: normalizedNip } : undefined,
        normalizedEmail
          ? {
              email: {
                equals: normalizedEmail,
                mode: "insensitive" as const,
              },
            }
          : undefined,
      ].filter((v): v is NonNullable<typeof v> => v != null),
    },
    select: {
      id: true,
      username: true,
      nip: true,
      email: true,
    },
  });

  const matchesByNip = normalizedNip
    ? users.filter((user) => normalizeNip(user.nip) === normalizedNip)
    : [];

  const matchesByEmail = normalizedEmail
    ? users.filter((user) => normalizeEmail(user.email) === normalizedEmail)
    : [];

  if (matchesByNip.length > 1 || matchesByEmail.length > 1) {
    return {
      userId: null,
      status: "conflict",
      message:
        "Ditemukan lebih dari satu kandidat user. Perlu pengaitan manual.",
    };
  }

  const nipSingle = matchesByNip.length === 1 ? matchesByNip[0] : null;
  const emailSingle = matchesByEmail.length === 1 ? matchesByEmail[0] : null;

  if (nipSingle && emailSingle && nipSingle.id !== emailSingle.id) {
    return {
      userId: null,
      status: "conflict",
      message:
        "Data NIP dan email mengarah ke user berbeda. Perlu pengaitan manual.",
    };
  }

  if (nipSingle) {
    return {
      userId: nipSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan NIP.",
    };
  }

  if (emailSingle) {
    return {
      userId: emailSingle.id,
      status: "linked_auto",
      message: "Pegawai berhasil dikaitkan otomatis ke user berdasarkan email.",
    };
  }

  return {
    userId: null,
    status: "unlinked",
    message: "Belum ada user yang cocok otomatis.",
  };
}
