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
      {
        source: "/api/employees",
        destination: `${backendOrigin}/api/employees`,
      },
      {
        source: "/api/employees/:path*",
        destination: `${backendOrigin}/api/employees/:path*`,
      },
      {
        source: "/api/activity",
        destination: `${backendOrigin}/api/activity`,
      },
      {
        source: "/api/documents",
        destination: `${backendOrigin}/api/documents`,
      },
      {
        source: "/api/documents/:id",
        destination: `${backendOrigin}/api/documents/:id`,
      },
    ];
  },
};

export default nextConfig;
