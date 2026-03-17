import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://172.30.28.9:3002", // ganti dengan origin yang anda pakai
  ],
};

export default nextConfig;
