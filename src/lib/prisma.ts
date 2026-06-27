import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // In Prisma 7, we need to pass adapter or accelerateUrl
  // For demo purposes, we create a client that will only work
  // when a real DATABASE_URL is configured
  try {
    return new PrismaClient();
  } catch {
    // Return a proxy that throws helpful errors when accessed
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then" || prop === "catch") return undefined;
        return () => {
          throw new Error(
            `Database not configured. Set DATABASE_URL in .env and run "npx prisma db push" to enable database features.`
          );
        };
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
