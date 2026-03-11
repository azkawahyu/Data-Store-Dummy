export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} tidak diizinkan`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file maksimal 5MB`);
  }
}
