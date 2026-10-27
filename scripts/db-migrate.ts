import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import { stdout } from "node:process";

async function main() {
  config({ path: "deployment/local/.env", quiet: true });

  const { db, sql } = await import("@/server/db/client");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");

  const extensionsSql = await readFile("drizzle/0000_extensions.sql", "utf8");
  await sql.unsafe(extensionsSql);
  stdout.write("extensions applied\n");

  await migrate(db, { migrationsFolder: "./drizzle" });
  stdout.write("migrations applied\n");

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
