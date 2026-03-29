import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import authRouter from "./routes/auth";

const port = Number.parseInt(process.env.BACKEND_PORT ?? "4000", 10);
const upstream = (
  process.env.BACKEND_UPSTREAM_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
const corsOrigin = process.env.CORS_ORIGIN ?? upstream;

const app = express();

app.set("trust proxy", true);
app.use(morgan("dev"));
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "backend",
    framework: "express",
    upstream,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "backend-api",
    framework: "express",
    upstream,
    timestamp: new Date().toISOString(),
  });
});

const proxyToFrontend = createProxyMiddleware({
  target: upstream,
  changeOrigin: true,
  ws: true,
});

app.use((req, res, next) => {
  if (req.path === "/health" || req.path === "/api/health") {
    return next();
  }

  return proxyToFrontend(req, res, next);
});

app.listen(port, () => {
  console.log(`Express backend listening on http://localhost:${port}`);
  console.log(`Proxying unknown routes to ${upstream}`);
});
