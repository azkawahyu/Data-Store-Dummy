import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        const creds = credentials as {
          username: string;
          password: string;
        };

        const user = await prisma.users.findUnique({
          where: {
            username: creds.username,
          },
          include: {
            roles: true,
          },
        });

        if (!user) {
          throw new Error("User tidak ditemukan");
        }

        if (creds.password !== user.password_hash) {
          throw new Error("Password salah");
        }

        return {
          id: String(user.id),
          username: user.username,
          role: user.roles?.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
