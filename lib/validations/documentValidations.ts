import { z } from "zod";

export const documentCreateSchema = z.object({
  employee_id: z
    .number({
      error: "Employee ID harus berupa angka"
    })
    .int()
    .positive()
    .optional(),

  document_type: z
    .string({
      error: "Tipe dokumen wajib diisi"
    })
    .min(1, "Tipe dokumen tidak boleh kosong")
    .max(50, "Tipe dokumen maksimal 50 karakter"),

  file_path: z
    .string({
      error: "File path wajib diisi"
    })
    .min(1, "File path tidak boleh kosong"),

  uploaded_at: z
    .coerce
    .date()
    .optional(),

  verified_by: z
    .number({
      error: "Verified by harus berupa angka"
    })
    .int()
    .positive()
    .optional(),

  verified_at: z
    .coerce
    .date()
    .optional()
});

export const documentUpdateSchema = z.object({
  employee_id: z.number().int().positive().optional(),

  document_type: z
    .string()
    .min(1, "Tipe dokumen tidak boleh kosong")
    .max(50)
    .optional(),

  file_path: z
    .string()
    .min(1, "File path tidak boleh kosong")
    .optional(),

  uploaded_at: z.coerce.date().optional(),

  verified_by: z.number().int().positive().optional(),

  verified_at: z.coerce.date().optional()
});