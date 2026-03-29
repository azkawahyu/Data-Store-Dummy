import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["backend/server.ts"],
  outDir: "dist/backend",
  format: ["esm"],
  platform: "node",
  target: "node18",
  bundle: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  dts: false,
  outExtension() {
    return { js: ".mjs" };
  },
  external: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "bcrypt",
    "cors",
    "express",
    "http-proxy-middleware",
    "jsonwebtoken",
    "morgan",
    "multer",
    "pg",
    "uuid",
  ],
});
