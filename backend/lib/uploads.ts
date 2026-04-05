import path from "path";

export const uploadsRoot = process.env.UPLOADS_ROOT
  ? path.resolve(process.env.UPLOADS_ROOT)
  : path.join(process.cwd(), "public", "uploads");
