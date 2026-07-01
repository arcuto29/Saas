/**
 * Prisma Client - Neon PostgreSQL (Prisma 7)
 * 
 * Uses dynamic imports to avoid build-time resolution issues.
 * Falls back to mock proxy when database is not configured.
 */

let prismaInstance: any = null;

async function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("user:password@localhost")) {
    return null;
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaNeon } = await import("@prisma/adapter-neon");
    const adapter = new PrismaNeon({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    return null;
  }
}

function getMockProxy(): any {
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

// Lazy proxy that initializes on first use
const prisma: any = new Proxy(
  {},
  {
    get(_, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") return undefined;

      // Return an async-compatible handler
      if (prop === "$connect" || prop === "$disconnect") {
        return async () => {
          if (!prismaInstance) {
            prismaInstance = await createPrismaClient();
          }
          if (prismaInstance) {
            return (prismaInstance as any)[prop]();
          }
        };
      }

      // For model access (application, user, etc.)
      return new Proxy(
        {},
        {
          get(__, modelProp) {
            return async (...args: any[]) => {
              if (!prismaInstance) {
                prismaInstance = await createPrismaClient();
              }
              if (!prismaInstance) {
                throw new Error("Database not configured");
              }
              const model = (prismaInstance as any)[prop];
              if (!model || typeof model[modelProp] !== "function") {
                throw new Error(`Unknown operation: ${String(prop)}.${String(modelProp)}`);
              }
              return model[modelProp](...args);
            };
          },
        }
      );
    },
  }
);

export { prisma };
export default prisma;
