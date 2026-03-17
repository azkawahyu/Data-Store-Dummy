import { z } from "zod";

export const uploadDocumentSchema = z.object({
  // employees.id is a UUID string in the database, accept non-empty string
  employee_id: z.string().min(1),
  document_type: z.string().min(2).max(100),
});
