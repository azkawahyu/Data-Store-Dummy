import { z } from "zod";

export const documentCreateSchema = z.object({
  // employee IDs are UUID strings in the DB
  employee_id: z
    .string({
      error: "Employee ID harus diisi sebagai string",
    })
    .min(1)
    .optional(),

  document_type: z
    .string({
      error: "Tipe dokumen wajib diisi",
    })
    .min(1, "Tipe dokumen tidak boleh kosong")
    .max(50, "Tipe dokumen maksimal 50 karakter"),

  file_path: z
    .string({
      error: "File path wajib diisi",
    })
    .min(1, "File path tidak boleh kosong"),

  uploaded_at: z.coerce.date().optional(),

  verified_by: z
    .string({
      error: "Verified by harus berupa string",
    })
    .min(1)
    .optional(),

  verified_at: z.coerce.date().optional(),
});

export const documentUpdateSchema = z.object({
  employee_id: z.string().min(1).optional(),

  document_type: z
    .string()
    .min(1, "Tipe dokumen tidak boleh kosong")
    .max(50)
    .optional(),

  file_path: z.string().min(1, "File path tidak boleh kosong").optional(),

  uploaded_at: z.coerce.date().optional(),

  verified_by: z.string().min(1).optional(),

  verified_at: z.coerce.date().optional(),
});
