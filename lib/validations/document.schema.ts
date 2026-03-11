import { z } from "zod";

export const uploadDocumentSchema = z.object({
  employee_id: z.coerce.number().int().positive(),
  document_type: z.string().min(2).max(100),
});
