/**
 * Prisma Client - Neon PostgreSQL (Prisma 7)
 * 
 * Uses the Neon serverless adapter for Prisma 7.
 * The app works with demo data when no database is configured.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient | any {
  if (prismaInstance) return prismaInstance;

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("user:password@localhost")) {
    // No real database configured — return mock proxy
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
          if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
          if (prop === "$queryRaw" || prop === "$executeRaw") return () => Promise.resolve([]);

          return new Proxy(
            {},
            {
              get() {
                return () => {
                  throw new Error(
                    'Database not configured. Set DATABASE_URL in .env and run "npx prisma db push"'
                  );
                };
              },
            }
          );
        },
      }
    );
  }

  try {
    const adapter = new PrismaNeon({ connectionString: databaseUrl });
    prismaInstance = new PrismaClient({ adapter });
    return prismaInstance;
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
          if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
          return new Proxy({}, { get() { return () => { throw new Error("Database connection failed"); }; } });
        },
      }
    );
  }
}

// Lazy proxy — only connects when first accessed
const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export { prisma };
export default prisma;
