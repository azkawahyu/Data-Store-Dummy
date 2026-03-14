export type DocumentStatus = "pending" | "verified" | "rejected";

export interface DocumentItem {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  uploadedAt: string;
  status: DocumentStatus;
  verifiedByName?: string;
  verifiedAt?: string;
}