export type DocumentStatus = "pending" | "verified" | "rejected";

export interface DocumentItem {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  fileSize?: number | null;
  filePath: string;
  mimeType: string;
  uploadedAt: string;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
}
