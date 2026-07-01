import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Hardcoded owner account — no database needed for login
const OWNER = {
  id: "owner-prisma-1",
  email: "owner@prismafx.com",
  password: "PrismaFx2024!",
  name: "Prisma",
  role: "owner",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-prismafx-2024",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Owner login (hardcoded — always works)
        if (email === OWNER.email && password === OWNER.password) {
          return {
            id: OWNER.id,
            email: OWNER.email,
            name: OWNER.name,
            image: null,
            role: OWNER.role,
          };
        }

        // Demo mode: any other email/password combo works as a regular user
        if (email && password && password.length >= 1) {
          return {
            id: "demo-user-1",
            email: email,
            name: email.split("@")[0],
            image: null,
            role: "user",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
  },
});
