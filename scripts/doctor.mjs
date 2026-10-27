import { config } from "dotenv";
import { existsSync } from "node:fs";
import { stdout, stderr } from "node:process";
import postgres from "postgres";

const ENV_FILE = "deployment/local/.env";

if (!existsSync(ENV_FILE)) {
  stderr.write(`[doctor] missing ${ENV_FILE} — cp deployment/.env.example ${ENV_FILE} rồi fill\n`);
  process.exit(1);
}
config({ path: ENV_FILE, quiet: true });

const failures = [];

const url = process.env.DATABASE_URL;
if (!url) {
  failures.push("DATABASE_URL chưa set");
} else {
  const sql = postgres(url, { connect_timeout: 3, max: 1 });
  try {
    await sql`select 1`;
    stdout.write("[doctor] db: OK\n");
  } catch (err) {
    failures.push(`db không kết nối được: ${err.message}`);
  } finally {
    await sql.end();
  }
}

if (process.env.AUTH_PROVIDER !== "clerk") {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    failures.push("SESSION_SECRET chưa set hoặc < 32 ký tự (auth local cần)");
  }
}

if (process.env.JOBS_PROVIDER === "temporal" && !process.env.TEMPORAL_ADDRESS) {
  failures.push("JOBS_PROVIDER=temporal nhưng TEMPORAL_ADDRESS trống");
}

if (failures.length > 0) {
  for (const f of failures) stderr.write(`[doctor] FAIL: ${f}\n`);
  process.exit(1);
}
stdout.write("[doctor] env: OK\n");
