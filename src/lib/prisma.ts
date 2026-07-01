// @ts-nocheck
/**
 * Database client using @neondatabase/serverless directly.
 * No Prisma adapter needed at runtime — just raw SQL via Neon's HTTP driver.
 * Prisma is only used for schema management (prisma db push / generate).
 */

import { neon } from "@neondatabase/serverless";

let sql: any = null;

function getSQL() {
  if (sql) return sql;
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("user:password@localhost")) {
    return null;
  }
  try {
    sql = neon(url);
    return sql;
  } catch (e) {
    console.error("[DB] Failed to initialize:", e);
    return null;
  }
}

// Database helper functions
export async function db() {
  return getSQL();
}

// User queries
export async function findUserByEmail(email: string) {
  const sql = getSQL();
  if (!sql) return null;
  try {
    const rows = await sql`SELECT * FROM "User" WHERE email = ${email} LIMIT 1`;
    return rows[0] || null;
  } catch (e) {
    console.error("[DB] findUserByEmail error:", e);
    return null;
  }
}

// Application queries
export async function createApplication(data: any) {
  const sql = getSQL();
  if (!sql) return null;
  try {
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 25);
    await sql`
      INSERT INTO "Application" (id, name, email, discord, plan, experience, market, goal, "biggestStruggle", "moneyLost", "triedBefore", availability, "whyNow", message, status, "createdAt", "updatedAt")
      VALUES (${id}, ${data.name}, ${data.email}, ${data.discord}, ${data.plan}, ${data.experience}, ${data.market}, ${data.goal}, ${data.biggestStruggle}, ${data.moneyLost}, ${data.triedBefore}, ${data.availability}, ${data.whyNow}, ${data.message}, 'pending', NOW(), NOW())
    `;
    return { id };
  } catch (e) {
    console.error("[DB] createApplication error:", e);
    return null;
  }
}

export async function listApplications() {
  const sql = getSQL();
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM "Application" ORDER BY "createdAt" DESC`;
    return rows;
  } catch (e) {
    console.error("[DB] listApplications error:", e);
    return [];
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  const sql = getSQL();
  if (!sql) return null;
  try {
    const rows = await sql`
      UPDATE "Application" SET status = ${status}, "updatedAt" = NOW() WHERE id = ${id} RETURNING *
    `;
    return rows[0] || null;
  } catch (e) {
    console.error("[DB] updateApplicationStatus error:", e);
    return null;
  }
}

export async function deleteApplication(id: string) {
  const sql = getSQL();
  if (!sql) return false;
  try {
    await sql`DELETE FROM "Application" WHERE id = ${id}`;
    return true;
  } catch (e) {
    console.error("[DB] deleteApplication error:", e);
    return false;
  }
}

// Keep a default export for backwards compat (returns mock)
const prisma: any = new Proxy({}, {
  get() {
    return new Proxy({}, {
      get() {
        return () => { throw new Error("Use named exports from @/lib/prisma instead"); };
      }
    });
  }
});

export { prisma };
export default prisma;
