import { z } from "zod";
import {
  EMAIL_MAX_LENGTH,
  NIP_MAX_LENGTH,
  NIP_MIN_LENGTH,
  NIP_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
  isValidUuid,
} from "./userRules";

const usernameSchema = z
  .string({ error: "Username wajib diisi" })
  .trim()
  .min(1, "Username wajib diisi")
  .min(USERNAME_MIN_LENGTH, "Username minimal 3 karakter")
  .max(USERNAME_MAX_LENGTH, "Username maksimal 100 karakter")
  .regex(
    USERNAME_REGEX,
    "Username hanya boleh huruf, angka, titik, garis bawah, atau strip",
  );

const nipSchema = z
  .string({ error: "NIP wajib diisi" })
  .trim()
  .min(1, "NIP wajib diisi")
  .min(NIP_MIN_LENGTH, "NIP minimal 8 digit")
  .max(NIP_MAX_LENGTH, "NIP maksimal 50 digit")
  .regex(NIP_REGEX, "NIP hanya boleh berisi angka");

const passwordSchema = z
  .string({ error: "Password wajib diisi" })
  .min(1, "Password wajib diisi")
  .min(PASSWORD_MIN_LENGTH, "Password minimal 8 karakter")
  .regex(
    PASSWORD_REGEX,
    "Password harus mengandung huruf dan angka tanpa spasi",
  );

const emailSchema = z
  .string({ error: "Email wajib diisi" })
  .trim()
  .min(1, "Email wajib diisi")
  .max(EMAIL_MAX_LENGTH, "Email maksimal 150 karakter")
  .email("Format email tidak valid");

const roleIdSchema = z
  .string({ error: "Role wajib dipilih" })
  .trim()
  .min(1, "Role wajib dipilih")
  .refine((value) => isValidUuid(value), {
    message: "Format role tidak valid",
  });

const employeeIdSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine((value) => value === null || isValidUuid(value), {
    message: "Format pegawai tidak valid",
  });

export const userCreateSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  nip: nipSchema,
  email: emailSchema,
  role_id: roleIdSchema,
  employee_id: employeeIdSchema,
});

export const userUpdateSchema = z.object({
  nip: nipSchema,
  email: emailSchema,
  role_id: roleIdSchema,
  employee_id: employeeIdSchema,
});
