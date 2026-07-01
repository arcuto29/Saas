// @ts-nocheck
/**
 * Prisma Client - Neon PostgreSQL (Prisma 7)
 * 
 * Lazy initialization — only connects when first database call is made.
 * Falls back gracefully when database is not configured or connection fails.
 */

let prismaInstance: any = null;
let initAttempted = false;

async function getClient() {
  if (prismaInstance) return prismaInstance;
  if (initAttempted) return null;
  initAttempted = true;

  const url = process.env.DATABASE_URL;
  if (!url || url.includes("user:password@localhost")) {
    return null;
  }

  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const adapter = new PrismaNeon({ connectionString: url });
    prismaInstance = new PrismaClient({ adapter });
    return prismaInstance;
  } catch (e) {
    console.error("[Prisma] Failed to initialize:", e);
    return null;
  }
}

// Helper function for use in API routes and auth
export async function db() {
  return await getClient();
}

// Proxy for backwards compatibility with `prisma.model.method()` syntax
const prisma: any = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
      
      // Return an object whose methods are async and get the client first
      return new Proxy(
        {},
        {
          get(__, methodName) {
            return async (...args: any[]) => {
              const client = await getClient();
              if (!client) {
                throw new Error("Database not available");
              }
              const model = client[prop];
              if (!model || typeof model[methodName] !== "function") {
                throw new Error(`Unknown: ${String(prop)}.${String(methodName)}`);
              }
              return model[methodName](...args);
            };
          },
        }
      );
    },
  }
);

export { prisma };
export default prisma;
