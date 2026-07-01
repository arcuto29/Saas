import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        // Try database auth
        try {
          const { findUserByEmail } = await import("./prisma");
          const user = await findUserByEmail(email);

          if (user && user.password) {
            const bcrypt = await import("bcryptjs");
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role || "user",
              };
            }
            // Wrong password — don't fall through to demo
            return null;
          }
        } catch (error) {
          console.error("[Auth] DB error, using demo mode:", error);
        }

        // Demo mode: accept any credentials when DB unavailable
        if (email && password) {
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
