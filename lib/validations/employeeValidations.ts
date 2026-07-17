import { z } from "zod";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "./userRules";

export const employeeSchema = z.object({
  nip: z.string().min(1, "NIP wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  unit: z.string().min(1, "Unit wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  no_hp: z.string().min(1, "No HP wajib diisi"),
  email: z
    .string({
      error: "Email wajib diisi",
    })
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

export const employeeAccountCreateSchema = employeeSchema.extend({
  username: z
    .string({ error: "Username wajib diisi" })
    .trim()
    .min(USERNAME_MIN_LENGTH, "Username minimal 3 karakter")
    .max(USERNAME_MAX_LENGTH, "Username maksimal 100 karakter")
    .regex(
      USERNAME_REGEX,
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip",
    ),
});
