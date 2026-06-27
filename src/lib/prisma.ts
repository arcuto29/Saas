/**
 * Prisma Client - Lazy Loading
 * 
 * This module exports a prisma client that loads lazily to avoid
 * build/startup errors when @prisma/client hasn't been generated yet.
 * 
 * Run `npx prisma generate` to generate the client.
 * The app works fully with demo data without a database.
 */

let prismaInstance: any = null;

function getPrismaClient() {
  if (prismaInstance) return prismaInstance;

  try {
    // Dynamic require to avoid module resolution errors at build time
    const { PrismaClient } = require("@prisma/client");
    prismaInstance = new PrismaClient();
    return prismaInstance;
  } catch {
    // Return a proxy that provides helpful error messages
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
          if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
          
          // Return a mock that throws on actual database operations
          return new Proxy(
            {},
            {
              get() {
                return () => {
                  throw new Error(
                    'Database not configured. Run "npx prisma generate" then set DATABASE_URL in .env'
                  );
                };
              },
            }
          );
        },
      }
    );
  }
}

// Use a getter so it's truly lazy
const prisma = new Proxy({} as any, {
  get(_, prop) {
    const client = getPrismaClient();
    return client[prop];
  },
});

export { prisma };
export default prisma;
