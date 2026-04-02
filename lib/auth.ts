import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compareStoredPassword } from "@/lib/password";

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

        const passwordMatch = await compareStoredPassword(
          creds.password,
          user.password_hash,
        );

        if (!passwordMatch) {
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

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
