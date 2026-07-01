// @ts-nocheck
/**
 * Prisma Client - Neon PostgreSQL (Prisma 7)
 * 
 * Uses @prisma/adapter-neon for serverless connection.
 * Falls back gracefully when database is not configured.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("user:password@localhost")) {
    return null;
  }
  try {
    const adapter = new PrismaNeon({ connectionString: url });
    return new PrismaClient({ adapter } as any);
  } catch (e) {
    console.error("Prisma init error:", e);
    return null;
  }
}

const prismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production" && prismaClient) {
  globalForPrisma.prisma = prismaClient;
}

// Export a proxy that gracefully handles missing database
const prisma: any = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
      if (prop === "$connect" || prop === "$disconnect") {
        return prismaClient
          ? () => (prismaClient as any)[prop]()
          : () => Promise.resolve();
      }

      if (!prismaClient) {
        return new Proxy(
          {},
          {
            get() {
              return () => {
                throw new Error(
                  "Database not configured. Set DATABASE_URL in environment variables."
                );
              };
            },
          }
        );
      }

      return (prismaClient as any)[prop];
    },
  }
);

export { prisma };
export default prisma;
