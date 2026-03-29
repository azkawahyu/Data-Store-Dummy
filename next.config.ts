import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.30.28.9", // ganti dengan origin yang anda pakai
  ],
  async rewrites() {
    const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://localhost:4000";

    return [
      {
        source: "/api/login",
        destination: `${backendOrigin}/api/login`,
      },
      {
        source: "/api/logout",
        destination: `${backendOrigin}/api/logout`,
      },
      {
        source: "/api/register",
        destination: `${backendOrigin}/api/register`,
      },
    ];
  },
};

export default nextConfig;
