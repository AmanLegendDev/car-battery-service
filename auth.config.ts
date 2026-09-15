import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(254),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128),
});

export default {
  providers: [
    Credentials({
      name: "Admin Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          await connectDB();

          const admin = await Admin.findOne({
            email: email.toLowerCase(),
            isActive: true,
          }).select("+passwordHash");

          if (!admin) {
            return null;
          }

          const passwordMatches = await bcrypt.compare(
            password,
            admin.passwordHash
          );

          if (!passwordMatches) {
            return null;
          }

          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        } catch (error) {
          console.error("Admin authentication error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin";
      }

      return session;
    },

    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      const isLoginPage =
        request.nextUrl.pathname === "/admin/login";

      if (!isAdminRoute) {
        return true;
      }

      if (isLoginPage) {
        return true;
      }

      return !!auth?.user && auth.user.role === "admin";
    },
  },

  trustHost: true,
} satisfies NextAuthConfig;