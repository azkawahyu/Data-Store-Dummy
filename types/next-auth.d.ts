import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role?: string;
      employee_id?: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    role?: string;
    employee_id?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role?: string;
    employee_id?: number;
  }
}
