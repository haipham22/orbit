import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as unknown as { orbitSql?: postgres.Sql };

export const sql = globalForDb.orbitSql ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.orbitSql = sql;
}

export const db = drizzle({ client: sql });
