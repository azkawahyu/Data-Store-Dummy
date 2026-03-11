import { z } from "zod";

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