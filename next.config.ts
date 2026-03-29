import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.30.28.9"],
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
      {
        source: "/api/user",
        destination: `${backendOrigin}/api/user`,
      },
      {
        source: "/api/user/:path*",
        destination: `${backendOrigin}/api/user/:path*`,
      },
      {
        source: "/api/roles",
        destination: `${backendOrigin}/api/roles`,
      },
    ];
  },
};

export default nextConfig;
