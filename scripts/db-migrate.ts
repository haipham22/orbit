import { config } from "dotenv";
import { readFile } from "node:fs/promises";

async function main() {
  config({ path: ".env.local", quiet: true });
  config({ quiet: true });

  const { db, sql } = await import("@/server/db/client");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");

  const extensionsSql = await readFile("drizzle/0000_extensions.sql", "utf8");
  await sql.unsafe(extensionsSql);
  console.log("extensions applied");

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("migrations applied");

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
